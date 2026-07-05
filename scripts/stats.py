from pathlib import Path


DATA_DIR = Path("data")


DOCUMENT_TYPES = {
    "Characters": "Character",
    "Events": "Event",
    "Events_Movies": "Event",
    "Locations": "Location",
    "Objects": "Object",
    "Organizations": "Organization",
    "Relationships": "Relationship",
    "Timeline": "Timeline",
}


def count_documents(universe_path):

    stats = {}

    total = 0

    for folder, doc_type in DOCUMENT_TYPES.items():

        folder_path = universe_path / folder

        if not folder_path.exists():
            continue

        count = len(list(folder_path.glob("*.txt")))

        stats[doc_type] = count

        total += count

    universe_docs = list(universe_path.glob("*Universe*.txt"))

    if universe_docs:

        stats["Universe"] = len(universe_docs)
        total += len(universe_docs)

    return stats, total


def print_stats():

    print("=" * 80)
    print("CogRealm Dataset Statistics")
    print("=" * 80)

    grand_total = 0

    for universe in sorted(DATA_DIR.iterdir()):

        if not universe.is_dir():
            continue

        stats, total = count_documents(universe)

        grand_total += total

        print(f"\n{universe.name}")
        print("-" * 40)

        for doc_type, count in stats.items():

            print(f"{doc_type:<15} {count}")

        print("-" * 40)
        print(f"{'Total':<15} {total}")

    print("\n" + "=" * 80)
    print(f"Overall Documents : {grand_total}")
    print("=" * 80)


if __name__ == "__main__":
    print_stats()

"""
Output Looks Like:

================================================================================
CogRealm Dataset Statistics
================================================================================

Harry_Potter
----------------------------------------
Character      142
Event          56
Location       18
Object         21
Universe       1
----------------------------------------
Total          238

Kung_Fu_Panda
----------------------------------------
Character      24
Event          18
Location       12
Object         9
Universe       1
----------------------------------------
Total          64

MCU
----------------------------------------
Character      178
Event          82
Location       33
Object         29
Universe       1
----------------------------------------
Total          323

================================================================================
Overall Documents : 625
================================================================================
"""