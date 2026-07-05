"""
Usage: python search.py
Example:
> Who is Harry Potter?

Harry Potter is the son of James Potter...
"""
import asyncio

import cognee
from cognee import SearchType

# import sys
# from pathlib import Path
# sys.path.append(str(Path(__file__).resolve().parents[1] / "app" / "backend"))

from cognee_bootstrap import configure_cognee, shutdown_cognee

SEARCH_TYPES = {
    "1": (
        "Graph Completion",
        SearchType.GRAPH_COMPLETION,
    ),
    "2": (
        "RAG Completion",
        SearchType.RAG_COMPLETION,
    ),
    "3": (
        "Graph + RAG",
        SearchType.GRAPH_COMPLETION_AND_RAG,
    ),
    "4": (
        "Summaries",
        SearchType.SUMMARIES,
    ),
    "5": (
        "Triplets",
        SearchType.CHUNKS_GRAPH,
    ),
}


async def choose_search_type():

    print("\nChoose Search Type\n")

    for key, (name, _) in SEARCH_TYPES.items():
        print(f"{key}. {name}")

    while True:

        choice = input("\nChoice: ").strip()

        if choice in SEARCH_TYPES:
            return SEARCH_TYPES[choice]

        print("Invalid choice.")


async def main():

    await configure_cognee()

    print("=" * 80)
    print("CogRealm Search Console")
    print("=" * 80)

    search_name, search_type = await choose_search_type()

    print(f"\nUsing: {search_name}")
    print("Type 'change' to change search type.")
    print("Type 'exit' to quit.\n")

    while True:

        query = input("> ").strip()

        if query.lower() == "exit":
            break

        if query.lower() == "change":
            search_name, search_type = await choose_search_type()
            print(f"\nSwitched to {search_name}\n")
            continue

        try:

            results = await cognee.search(
                query_type=search_type,
                query_text=query,
            )

            print()

            if not results:
                print("No results.\n")
                continue

            for i, result in enumerate(results, 1):

                print("=" * 80)
                print(f"Result {i}")
                print("=" * 80)

                print(f"Dataset: {result['dataset_name']}")
                for item in result["search_result"]:
                    print(item)

                print()

        except Exception as e:

            print("\nERROR")
            print(e)
        finally:
            await shutdown_cognee()


if __name__ == "__main__":
    asyncio.run(main())