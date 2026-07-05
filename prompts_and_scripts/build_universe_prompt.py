def build_universe_prompt(raw_data: str) -> str:
    """
    Inserts user-provided raw character data into the Cognee fictional universe prompt.
    """

    specific_prompt = """Generate a Universe Knowledge Document.

Describe:

Creation of the world.

Major civilizations.

Political systems.

Magic or power systems.

Technology.

Geography.

Species.

Religions.

Economy.

History.

Major wars.

Major organizations.

Major locations.

Timeline overview.

Current state of the world.

The document should introduce someone to the universe from scratch.
"""

    template = """You are a Semantic Knowledge Curator responsible for transforming raw fictional universe information into high-quality documents optimized for AI memory systems and knowledge graph construction.

The generated document will be directly ingested into Cognee.

Your primary objective is to maximize:

• Entity extraction
• Relationship extraction
• Temporal reasoning
• Causal reasoning
• Knowledge graph connectivity
• Context preservation
• Long-term semantic retrieval

Do NOT summarize.

Instead, reconstruct the provided information into an explicit, semantically rich document.

General Rules

• Preserve every important fact.
• Never invent information.
• Expand implicit information into explicit relationships whenever supported.
• Use complete names instead of pronouns whenever possible.
• Write in natural English.
• Avoid lists unless specifically requested.
• Never output JSON.
• Never output markdown tables.
• Merge duplicated facts.
• Explicitly mention aliases.
• Preserve chronology.
• Explain why events matter.
• Explain how relationships evolved.
• Explain causes and consequences.
• Mention locations whenever available.
• Mention organizations whenever relevant.
• Mention ownership whenever objects exist.
• Every paragraph should naturally expose graph triplets.

Example:

Naruto Uzumaki is the son of Minato Namikaze.

Naruto Uzumaki belongs to Konohagakure.

Naruto Uzumaki is friends with Sasuke Uchiha.

These explicit relationships are preferred over compressed writing.

Always optimize for semantic understanding rather than literary quality.

Output should be well-organized and internally consistent.

Universe Perspective Prompt

{specific_prompt}

The output should be in the following format:

document_type: character
primary_entity: <Extract from raw data>
related_entities:
  - <Extract important related entities>
timeline_range: <Infer from provided data>
canonical_source: <Source>

<your_generated_memory_document>

Here is the raw data:
{raw_data}
"""
    return template.format(specific_prompt=specific_prompt, raw_data=raw_data)


if __name__ == "__main__":
    print("Paste the raw data below.")
    print("When finished, type 'exit()' and press Enter again.\n")

    lines = []
    while True:
        line = input()
        if line == "exit()":
            break
        lines.append(line)

    raw_data = "\n".join(lines)

    final_prompt = build_universe_prompt(raw_data)

    print("\n" + "=" * 80)
    print(final_prompt)
    print("=" * 80)

    # Optional: Save to a file
    with open("generated_prompt.txt", "w", encoding="utf-8") as f:
        f.write(final_prompt)

    print("\nPrompt saved as generated_prompt.txt")
