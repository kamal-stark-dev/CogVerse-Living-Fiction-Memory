from pathlib import Path
import sqlite3
import os

PROJECT = Path.cwd()

SYSTEM = PROJECT / ".cognee_system"
DATA = PROJECT / ".cognee_data"

print("=" * 70)
print("CogVerse Graph Statistics")
print("=" * 70)

print("\nStorage")

for folder in [SYSTEM, DATA]:

    if folder.exists():

        size = sum(
            f.stat().st_size
            for f in folder.rglob("*")
            if f.is_file()
        )

        print(f"{folder.name:<20} {size/1024/1024:.2f} MB")

print()

dbs = list(SYSTEM.rglob("*.db"))

for db in dbs:

    print("-" * 70)
    print(db.name)

    try:

        conn = sqlite3.connect(db)

        cur = conn.cursor()

        cur.execute("""
        SELECT name
        FROM sqlite_master
        WHERE type='table'
        """)

        tables = cur.fetchall()

        print(f"Tables : {len(tables)}")

        for table in tables:

            table = table[0]

            try:

                cur.execute(f"SELECT COUNT(*) FROM {table}")

                count = cur.fetchone()[0]

                print(f"{table:<35} {count}")

            except Exception:
                pass

        conn.close()

    except Exception as e:

        print(e)