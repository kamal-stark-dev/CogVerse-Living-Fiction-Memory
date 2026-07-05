import asyncio, cognee
from cognee import SearchType

# import sys
# from pathlib import Path
# sys.path.append(str(Path(__file__).resolve().parents[1] / "app" / "backend"))

from cognee_bootstrap import configure_cognee, shutdown_cognee

async def test():
    await configure_cognee()

    await cognee.add(
        "Naruto Uzumaki is a ninja of Konoha. His best friend is Sasuke Uchiha.",
        dataset_name="sanity_test",
    )
    await cognee.cognify(datasets=["sanity_test"])

    response = await cognee.search(
        query_type=SearchType.GRAPH_COMPLETION,
        query_text="Who is Naruto's best friend?",
        datasets=["sanity_test"],
    )
    print(response)

    # raw = await cognee.search(
    #     query_type=SearchType.GRAPH_COMPLETION,
    #     query_text="Tony Stark",
    #     datasets=["MCU"],
    #     only_context=True,
    # )
    # print(type(raw), raw)

    await shutdown_cognee()

asyncio.run(test())