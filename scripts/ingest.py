import asyncio
import json
import time
from pathlib import Path
from datetime import datetime
import argparse
import sys

import cognee
from dotenv import load_dotenv

# -----------------------------------------------------------------------------
# Project Paths
# -----------------------------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Allow importing from app/backend
sys.path.append(str(PROJECT_ROOT / "app" / "backend"))

load_dotenv(PROJECT_ROOT / ".env")

from cognee_bootstrap import configure_cognee, shutdown_cognee

DATA_ROOT = PROJECT_ROOT / "data"
STATE_FILE = PROJECT_ROOT / "state" / "ingest_state.json"

RATE_LIMIT_DELAY = 2
MAX_RETRIES = 3


# -----------------------------------------------------------------------------
# State Helpers
# -----------------------------------------------------------------------------

def load_state():
    if not STATE_FILE.exists():
        return {}

    with open(STATE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_state(state):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=4)


# -----------------------------------------------------------------------------
# Retry Wrapper
# -----------------------------------------------------------------------------

async def remember_document(text: str, dataset_name: str):

    for attempt in range(MAX_RETRIES):

        try:
            await cognee.remember(
                text,
                dataset_name=dataset_name,
            )
            return True

        except Exception as e:

            print(f"\nRetry {attempt + 1}/{MAX_RETRIES}")
            print(e)

            if attempt == MAX_RETRIES - 1:
                return False

            await asyncio.sleep(10)


# -----------------------------------------------------------------------------
# Ingest
# -----------------------------------------------------------------------------

async def ingest_universe(universe_name: str):

    root = DATA_ROOT / universe_name

    print("\n")
    print("=" * 70)
    print("PROJECT ROOT :", PROJECT_ROOT)
    print("DATA ROOT    :", DATA_ROOT)
    print("UNIVERSE PATH:", root)
    print("Exists       :", root.exists())
    print("=" * 70)
    print()

    if not root.exists():
        print("Universe folder does not exist.")
        return

    files = sorted(root.rglob("*.txt"))

    if not files:
        print("No documents found.")
        return

    state = load_state()
    universe_state = state.setdefault(universe_name, {})

    total = len(files)

    skipped = 0
    completed = 0
    failed = 0

    print("=" * 60)
    print(f"Universe : {universe_name}")
    print(f"Documents: {total}")
    print("=" * 60)

    start = time.time()

    for index, file in enumerate(files, start=1):

        relative_path = str(file.relative_to(root))

        entry = universe_state.get(relative_path)

        if entry and entry.get("status") == "completed":

            skipped += 1

            print(f"[{index}/{total}] SKIP    {relative_path}")

            continue

        print(f"[{index}/{total}] INGEST  {relative_path}")

        try:
            text = file.read_text(encoding="utf-8")

        except Exception as e:

            print(f"Failed reading file: {e}")

            failed += 1

            continue

        success = await remember_document(
            text=text,
            dataset_name=universe_name,
        )

        if success:

            document_type = file.parent.name.rstrip("s")

            universe_state[relative_path] = {
                "status": "completed",
                "timestamp": datetime.now().isoformat(timespec="seconds"),
                "document_type": document_type,
                "entity_name": file.stem,
                "relative_path": relative_path,
            }

            save_state(state)

            completed += 1

        else:
            failed += 1

        await asyncio.sleep(RATE_LIMIT_DELAY)

    print("\n")
    print("=" * 60)
    print("Remember Phase Complete")
    print("=" * 60)

    print(f"Completed : {completed}")
    print(f"Skipped   : {skipped}")
    print(f"Failed    : {failed}")

    print("\nStarting Cognify...\n")

    await cognee.cognify(
        datasets=[universe_name]
    )

    elapsed = time.time() - start

    print("\n")
    print("=" * 60)
    print("INGESTION COMPLETE")
    print("=" * 60)

    print(f"Universe : {universe_name}")
    print(f"Documents: {total}")
    print(f"New      : {completed}")
    print(f"Skipped  : {skipped}")
    print(f"Failed   : {failed}")
    print(f"Time     : {elapsed:.2f}s")


# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------

async def main():

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--universe",
        required=True,
        help="Folder name inside data/"
    )

    args = parser.parse_args()

    await configure_cognee()

    try:
        await ingest_universe(args.universe)

    finally:
        await shutdown_cognee()


if __name__ == "__main__":
    asyncio.run(main())