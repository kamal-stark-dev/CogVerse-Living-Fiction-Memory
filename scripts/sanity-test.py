import asyncio, cognee
from cognee import SearchType

async def test():
    await cognee.remember("Naruto Uzumkai is a ninja of Konoha. His best friend is Sasuke Uchiha.")

    await cognee.cognify()

    response = await cognee.recall(query_type=SearchType.GRAPH_COMPLETION, query_text="Who is Naruto's best friend?")
    print(response)

asyncio.run(test())