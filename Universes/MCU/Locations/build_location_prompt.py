def build_location_prompt(raw_data: str) -> str:
    """
    Inserts user-provided raw location data into the MCU location prompt.
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

Wakanda is the homeland of T'Challa and the Black Panther legacy.

The Avengers Compound served as a headquarters for the Avengers.

Asgard was the realm of Odin, Thor, Loki, and the Asgardian royal family.

These explicit relationships are preferred over compressed writing.

Always optimize for semantic understanding rather than literary quality.

Output should be well-organized and internally consistent.

Location Perspective Prompt

Your task is to generate a complete MCU Location Knowledge Document.

Focus entirely on a single location from the Marvel Cinematic Universe.

The document should explain:

Identity and aliases

Geography and physical description

Origin or founding

Political or strategic importance

Purpose

History

Government or leadership

Organizations operating there

Important residents

Important visitors

Notable landmarks

Natural features

Resources or technology

Culture

Major historical events

Battles

Connections to other locations

How the location changes over time

Current status

Legacy

Every relationship should be written as complete sentences.

Historical events must appear chronologically.

Explain how the location changes over time.

Explain why the location matters within the MCU.

Do not discuss comics-only continuity unless the MCU source clearly supports it.

Focus on primary MCU sources such as marvelcinematicuniverse.fandom.com, and use marvel.fandom.com only for MCU-compatible confirmation.

document_type: location
primary_entity: <Extract from raw data>
related_entities:
  - <Extract important related entities>
timeline_range: <Infer from provided data>
canonical_source: marvelcinematicuniverse.fandom.com, marvel.fandom.com

<your_data>

{raw_data}
"""

    return template.format(raw_data=raw_data)


if __name__ == "__main__":
    print("Paste the raw location data below.")
    print("When finished, type 'exit()' and press Enter again.\n")

    lines = []
    while True:
        line = input()
        if line == "exit()":
            break
        lines.append(line)

    raw_data = "\n".join(lines)

    final_prompt = build_location_prompt(raw_data)

    print("\n" + "=" * 80)
    print(final_prompt)
    print("=" * 80)

    with open("generated_prompt.txt", "w", encoding="utf-8") as f:
        f.write(final_prompt)

    print("\nPrompt saved as generated_prompt.txt")