def build_character_prompt(raw_data: str) -> str:
    """
    Inserts user-provided raw character data into the Cognee character prompt.
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

Character Perspective Prompt

Your task is to generate a complete Character Knowledge Document.

Focus entirely on a single character.

The document should explain:

Identity

Aliases

Titles

Background

Family

Friends

Enemies

Mentors

Students

Organizations

Political affiliations

Villages

Schools

Teams

Abilities

Powers

Weapons

Important possessions

Personality

Beliefs

Goals

Major victories

Major defeats

Important decisions

Character development

Death (if applicable)

Legacy

Every relationship should be written as complete sentences.

Life events must appear chronologically.

Explain how the character changes over time.

Do not discuss unrelated world history unless it directly affects this character.

document_type: character
primary_entity: <Extract from raw data>
related_entities:
  - <Extract important related entities>
timeline_range: <Infer from provided data>
canonical_source: kungfupanda.fandom.com

<your_data>

{raw_data}
"""
    return template.format(raw_data=raw_data)


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

    final_prompt = build_character_prompt(raw_data)

    print("\n" + "=" * 80)
    print(final_prompt)
    print("=" * 80)

    # Optional: Save to a file
    with open("generated_prompt.txt", "w", encoding="utf-8") as f:
        f.write(final_prompt)

    print("\nPrompt saved as generated_prompt.txt")
