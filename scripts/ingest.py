import asyncio
import json
import time
from pathlib import Path
from datetime import datetime

import cognee

# ------------------------------------------
# Configuration
# ------------------------------------------

STATE_FILE = Path("state/ingest_state.json")

RATE_LIMIT_DELAY = 2        # seconds between remember() calls
MAX_RETRIES = 3


# ------------------------------------------
# State Helpers
# ------------------------------------------

def load_state():
    if not STATE_FILE.exists():
        return {}

    with open(STATE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_state(state):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=4)


# ------------------------------------------
# Retry Wrapper
# ------------------------------------------

async def remember_document(text, dataset_name):

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


# ------------------------------------------
# Ingestion
# ------------------------------------------

async def ingest_universe(
    universe_name: str,
    data_dir: str,
):

    root = Path(data_dir)

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

            print(
                f"[{index}/{total}] SKIP   {relative_path}"
            )

            continue

        print(
            f"[{index}/{total}] INGEST {relative_path}"
        )

        try:

            text = file.read_text(
                encoding="utf-8"
            )

        except Exception as e:

            print(f"Failed reading file: {e}")

            failed += 1

            continue

        success = await remember_document(
            text=text,
            dataset_name=universe_name,
        )

        if success:

            document_type = file.parent.name.rstrip("s")  # Characters -> Character
            entity_name = file.stem

            universe_state[relative_path] = {
                "status": "completed",
                "timestamp": datetime.now().isoformat(timespec="seconds"),
                "document_type": document_type,
                "entity_name": entity_name,
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

    print("\nRunning Cognify...\n")

    await cognee.cognify(
        datasets=[universe_name]
    )

    elapsed = time.time() - start

    print("\n")
    print("=" * 60)
    print("INGESTION COMPLETE")
    print("=" * 60)

    print(f"Universe  : {universe_name}")
    print(f"Documents : {total}")
    print(f"New        : {completed}")
    print(f"Skipped    : {skipped}")
    print(f"Failed     : {failed}")
    print(f"Time       : {elapsed:.2f}s")


# ------------------------------------------
# Main
# ------------------------------------------

async def main():

    await ingest_universe(
        universe_name="MCU",
        data_dir="data/curated/MCU",
    )


if __name__ == "__main__":
    asyncio.run(main())