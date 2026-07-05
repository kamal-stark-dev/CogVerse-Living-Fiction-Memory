import os
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

import cognee
from cognee import SearchType
from cognee_bootstrap import configure_cognee, shutdown_cognee

from persona import build_system_prompt
from groq_client import generate_reply
from graph_utils import parse_graph_context

# Path to your existing repo's `data/` folder (NOT Cognee's DATA_ROOT_DIRECTORY).
# This is only used to populate the UI's universe/character dropdowns from your
# existing folder structure (data/<Universe>/Characters/*.txt).
# Adjust the default if you run uvicorn from a different working directory.
DATA_DIR = Path(os.getenv("REPO_DATA_DIR", "../../data")).resolve()

app = FastAPI(title="CogVerse API")

@app.on_event("startup")
async def startup():
    await configure_cognee()


@app.on_event("shutdown")
async def shutdown():
    await shutdown_cognee()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # Without this, unhandled exceptions (like Cognee's DatasetNotFoundError)
    # bypass CORSMiddleware entirely, and the browser reports them as a
    # generic "Failed to fetch" instead of showing the real error. Registering
    # this handler keeps the response inside FastAPI's normal flow, so CORS
    # headers still get attached and the frontend sees the actual message.
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "error_type": type(exc).__name__},
    )


def _list_universes():
    if not DATA_DIR.exists():
        return []
    return sorted(p.name for p in DATA_DIR.iterdir() if p.is_dir())


def _list_characters(universe: str):
    char_dir = DATA_DIR / universe / "Characters"
    if not char_dir.exists():
        return []
    return sorted(p.stem.replace("_", " ") for p in char_dir.glob("*.txt"))


@app.get("/universes")
def get_universes():
    return {"universes": _list_universes()}


@app.get("/universes/{universe}/characters")
def get_characters(universe: str):
    if universe not in _list_universes():
        raise HTTPException(404, f"Unknown universe: {universe}")
    return {"characters": _list_characters(universe)}


@app.get("/universes/{universe}/characters/{character}/graph")
async def get_character_graph(universe: str, character: str):
    if universe not in _list_universes():
        raise HTTPException(404, f"Unknown universe: {universe}")

    # SearchType.INSIGHTS is MCP-only, not exposed via the Python SDK.
    # only_context=True on GRAPH_COMPLETION returns the raw retrieved
    # nodes/triplets instead of the synthesized natural-language answer,
    # which is what we actually want to turn into a graph.
    try:
        raw = await cognee.search(
            query_type=SearchType.GRAPH_COMPLETION,
            query_text=character,
            datasets=[universe],
            only_context=True,
        )
    except TypeError:
        # Some installed versions may not accept only_context as a kwarg
        # here -- fall back to a normal call. This will likely return a
        # synthesized answer rather than raw triplets, so parse_graph_context
        # will probably come back empty. If that happens consistently, print
        # `raw` below and check your installed Cognee version's docs for the
        # correct way to request raw context (may be a `recall()`-only
        # parameter, or a different kwarg name, in your version).
        raw = await cognee.search(
            query_type=SearchType.GRAPH_COMPLETION,
            query_text=character,
            datasets=[universe],
        )

    edges = parse_graph_context(raw, character)

    return {"character": character, "edges": edges}


class ChatRequest(BaseModel):
    speaker: str
    speaker_universe: str
    question: str
    reference_universe: Optional[str] = None
    reference_query: Optional[str] = None


@app.post("/chat")
async def chat(req: ChatRequest):
    # Pull persona-relevant, graph-grounded facts about the speaker from their
    # own universe's dataset.
    primary_context = await cognee.search(
        query_type=SearchType.GRAPH_COMPLETION,
        query_text=(
            f"{req.speaker}'s personality, values, speech style, relationships, "
            f"and any facts relevant to: {req.question}"
        ),
        datasets=[req.speaker_universe],
    )

    # Optional second lookup for cross-universe questions
    # (e.g. "what happened when Sirius died" queried against harry_potter's dataset,
    # while the speaker is Naruto from the naruto dataset).
    reference_context = None
    if req.reference_universe and req.reference_query:
        reference_context = await cognee.search(
            query_type=SearchType.GRAPH_COMPLETION,
            query_text=req.reference_query,
            datasets=[req.reference_universe],
        )

    system_prompt = build_system_prompt(
        speaker=req.speaker,
        primary_context=primary_context,
        reference_context=reference_context,
    )

    answer = generate_reply(system_prompt, req.question)

    return {
        "answer": answer,
        # Sent back so the UI can show *why* the character said what they said —
        # this is the "memory trace" panel in the frontend.
        "memory_trace": {
            "primary": primary_context,
            "reference": reference_context,
        },
    }