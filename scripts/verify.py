"""
Usage: python verify.py --universe Harry_Potter
"""

import asyncio
import argparse

import cognee
from cognee import SearchType

# import sys
# from pathlib import Path
# sys.path.append(str(Path(__file__).resolve().parents[1] / "app" / "backend"))

from cognee_bootstrap import configure_cognee, shutdown_cognee


# Questions that every universe should be able to answer.
VERIFY_QUESTIONS = {
    "Harry_Potter": [
        "Who is Harry Potter?",
        "Who are Harry Potter's parents?",
        "Who is Harry Potter's best friend?",
        "What is Hogwarts?",
        "Who founded Hogwarts?",
        "What happened during the Battle of Hogwarts?",
        "What is the Elder Wand?",
        "Who owns the Elder Wand?"
    ],
    "MCU": [
        "Who is Iron Man?",
        "Who is Steve Rogers?",
        "What are the Infinity Stones?",
        "Who is Thanos?",
        "Who founded the Avengers?",
        "What happened during the Infinity War?"
    ],
    "Kung_Fu_Panda": [
        "Who is Po?",
        "Who trained Po?",
        "Who is Tai Lung?",
        "What is the Dragon Scroll?"
    ],
    "Test_Universe": [
        # "Who is Iron Man?",
        # "Who is Spider-Man?",
        # "Where is Stark Tower?",
        # "What is Arc Reactor?",
        # "Who possesses the Infinity Stones?",
        # "What happened during Civil War?"
        "Who is Iron Man and Spider Man?"
    ]
}


async def verify(universe):
    questions = VERIFY_QUESTIONS.get(universe)

    if questions is None:
        print(f"No verification questions defined for {universe}")
        return

    print("=" * 80)
    print(f"Verifying {universe}")
    print("=" * 80)

    passed = 0

    for question in questions:
        print(f"\nQ: {question}")

        try:
            response = await cognee.search(
                query_type=SearchType.GRAPH_COMPLETION,
                query_text=question,
            )

            if response:
                passed += 1

                print("✓ Answer Found")
                print(response)
                print(response[0]["search_result"])

            else:
                print("✗ No Answer")

        except Exception as e:

            print("✗ ERROR")
            print(e)

    print("\n")
    print("=" * 80)
    print(f"{passed}/{len(questions)} questions answered.")
    print("=" * 80)


async def main():

    await configure_cognee()

    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--universe",
        required=True,
    )

    args = parser.parse_args()
    try:
        await verify(args.universe)
    finally:
        await shutdown_cognee()


if __name__ == "__main__":
    asyncio.run(main())