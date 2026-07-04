import asyncio, cognee
from cognee import SearchType

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[1] / "app" / "backend"))

from cognee_bootstrap import configure_cognee, shutdown_cognee

async def test():
    await configure_cognee()

    await cognee.remember("Naruto Uzumkai is a ninja of Konoha. His best friend is Sasuke Uchiha.")

    await cognee.cognify()

    response = await cognee.recall(query_type=SearchType.GRAPH_COMPLETION, query_text="Who is Naruto's best friend?")
    print(response)

    await shutdown_cognee()

asyncio.run(test())