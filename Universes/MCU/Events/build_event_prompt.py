def build_event_prompt(raw_data: str) -> str:
    """
    Inserts user-provided raw event data into the MCU event prompt.
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

Tony Stark built the Arc Reactor to keep himself alive.

The Battle of New York forced the Avengers to act as a team.

Thanos used the Infinity Gauntlet to erase half of all life.

These explicit relationships are preferred over compressed writing.

Always optimize for semantic understanding rather than literary quality.

Output should be well-organized and internally consistent.

Event Perspective Prompt

Your task is to generate a complete MCU Event Knowledge Document.

Focus entirely on one event from the Marvel Cinematic Universe.

The document should explain:

What happened.

When it happened.

Where it happened.

Why it happened.

Who participated.

Each participant's role.

Important battles.

Important conversations.

Key turning points.

Immediate consequences.

Long-term consequences.

Political consequences.

Emotional consequences.

Changes to the world after the event.

If multiple events are connected, explain their causal relationship.

The event should become understandable even without prior knowledge of the universe.

Every relationship should be written as complete sentences.

Present events in chronological order.

Explicitly explain causes, actions, consequences, and how the event changed the fictional world.

Do not discuss comics-only continuity unless the MCU source clearly supports it.

Focus on primary MCU sources such as marvelcinematicuniverse.fandom.com, and use marvel.fandom.com only for MCU-compatible confirmation.

document_type: event
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
    print("Paste the raw event data below.")
    print("When finished, type 'exit()' and press Enter again.\n")

    lines = []
    while True:
        line = input()
        if line == "exit()":
            break
        lines.append(line)

    raw_data = "\n".join(lines)

    final_prompt = build_event_prompt(raw_data)

    print("\n" + "=" * 80)
    print(final_prompt)
    print("=" * 80)

    with open("generated_prompt.txt", "w", encoding="utf-8") as f:
        f.write(final_prompt)

    print("\nPrompt saved as generated_prompt.txt")