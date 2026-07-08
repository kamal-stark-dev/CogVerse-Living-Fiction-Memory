import os
from groq import Groq

# Module-level client used when no user-supplied key is provided.
# Falls back gracefully to the server-side GROQ_API_KEY env var.
_default_client = Groq(api_key=os.environ["GROQ_API_KEY"])

MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")


def generate_reply(
    system_prompt: str,
    user_question: str,
    api_key: str | None = None,
) -> str:
    """Generate an in-character reply via Groq.

    If `api_key` is provided (user-supplied from the frontend), a per-request
    Groq client is created with that key. Otherwise the module-level default
    client (backed by the server's GROQ_API_KEY env var) is used.
    """
    client = Groq(api_key=api_key) if api_key else _default_client
    completion = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_question},
        ],
        temperature=0.8,
    )
    return completion.choices[0].message.content
