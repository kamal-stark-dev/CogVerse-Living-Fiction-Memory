# ingestion pipeline

import asyncio
from pathlib import Path

import cognee

async def ingest_universe(universe_name: str, data_dir: str):
    data_path = Path(data_dir)

    # Find every .txt file recursively
    files = sorted(data_path.rglob("*.txt"))

    print(f"Found {len(files)} text files.\n")

    for i, file in enumerate(files, start=1):
        print(f"[{i}/{len(files)}] Ingesting {file.relative_to(data_path)}")

        text = file.read_text(encoding="utf-8")

        await cognee.remember(
            text,
            dataset_name=universe_name,
        )

    print("\nAll documents remembered.")
    print("Starting cognify...")

    # Cognify once after everything is added
    await cognee.cognify(datasets=[universe_name])

    print(f"\n✅ Universe '{universe_name}' successfully ingested!")


async def main():
    await ingest_universe(
        universe_name="harry_potter",
        data_dir="Universes/MCU",
    )


if __name__ == "__main__":
    asyncio.run(main())