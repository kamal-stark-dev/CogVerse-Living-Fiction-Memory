# MCU Semantic Extraction Prompts

Use these prompts when asking Gemini to extract compact semantic-memory documents for the Marvel Cinematic Universe from Fandom pages.

The goal is not to write a long encyclopedia entry. The goal is to collect enough canon detail for Cognee to build a strong knowledge graph while keeping the document close to the size and density of the existing Kung Fu Panda universe text files.

## Shared Extraction Rules

Use the following rules for every MCU document:

- Prefer `marvelcinematicuniverse.fandom.com` as the primary source.
- Use `marvel.fandom.com` only when it helps confirm a name, alias, object, location, or MCU-compatible detail.
- Do not import comics-only facts unless the MCU page explicitly supports them.
- Keep the output concise, focused, and canon-heavy.
- Preserve canonical names, aliases, relationships, affiliations, causes, and consequences.
- Write in natural English, not bullets unless the structure requires them.
- Do not output JSON or tables.
- Do not over-explain minor details.
- Include only the most important MCU facts needed for memory and graph extraction.
- If a fact is uncertain, disputed, or version-specific, say so clearly.

## Recommended Output Format

Each extracted document should end with these metadata lines:

`document_type: character | event | location | object`

`primary_entity: <entity name>`

`related_entities: <short list of the most important related entities>`

`timeline_range: <rough MCU time span or phase>`

`canonical_source: marvelcinematicuniverse.fandom.com, marvel.fandom.com`

## Character Prompt

```text
You are an MCU canon extraction assistant.

Your task is to extract one character from the Marvel Cinematic Universe using the Fandom pages provided or discovered during browsing.

Primary source priority:
- First: marvelcinematicuniverse.fandom.com
- Second: marvel.fandom.com only for MCU-compatible confirmation or missing supporting detail

Keep the final document concise but complete. The output should be detailed enough for Cognee to build a strong graph, but it should not become an encyclopedic biography.

Focus on:
- Identity
- Aliases and titles
- Origin and background
- Family and close relationships
- Allies and enemies
- Affiliations and organizations
- Powers, abilities, skills, suits, weapons, or technology
- Major MCU events
- Personality and motivations
- Character growth
- Current status or legacy in the MCU

Prefer a single coherent narrative with a few well-formed paragraphs. Avoid exhaustive film-by-film summaries. Mention only the most important events and relationships.

Use explicit relationship sentences such as:
- Tony Stark is Iron Man.
- Steve Rogers is Captain America.
- Natasha Romanoff is an Avenger and a former S.H.I.E.L.D. operative.

Do not include comics-only continuity unless the MCU source clearly supports it.

Return a semantically rich document for the character.
```

## Event Prompt

```text
You are an MCU canon extraction assistant.

Your task is to extract one major event from the Marvel Cinematic Universe using the Fandom pages provided or discovered during browsing.

Primary source priority:
- First: marvelcinematicuniverse.fandom.com
- Second: marvel.fandom.com only for MCU-compatible confirmation or missing supporting detail

Keep the final document concise but complete. The output should be detailed enough for Cognee to build a strong graph, but it should not become an encyclopedic event history.

Focus on:
- What happened
- Who participated
- Where it happened
- Why it happened
- What triggered it
- Immediate consequences
- Long-term consequences
- Political consequences
- Emotional consequences
- Any important objects, powers, or locations involved

Examples of MCU events that fit this format include the Battle of New York, the Sokovia Accords, the Battle of Wakanda, the Snap, and the Blip.

Prefer one coherent narrative that explains causality and aftermath. Avoid overlong plot summaries.

Use explicit relationship sentences such as:
- Loki attacked New York during the Chitauri invasion.
- The Battle of Wakanda changed the course of the Infinity War.
- Thanos used the Infinity Gauntlet to erase half of all life.

Do not include comics-only continuity unless the MCU source clearly supports it.

Return a semantically rich document for the event.
```

## Location Prompt

```text
You are an MCU canon extraction assistant.

Your task is to extract one location from the Marvel Cinematic Universe using the Fandom pages provided or discovered during browsing.

Primary source priority:
- First: marvelcinematicuniverse.fandom.com
- Second: marvel.fandom.com only for MCU-compatible confirmation or missing supporting detail

Keep the final document concise but complete. The output should be detailed enough for Cognee to build a strong graph, but it should not become an encyclopedic location profile.

Focus on:
- Identity and aliases
- Geography and physical description
- Origin or founding
- Political or strategic importance
- Organizations operating there
- Notable residents or visitors
- Important landmarks
- Resources or technology, if relevant
- Historical events that took place there
- How the location changes over time
- Why the location matters in the MCU

Examples of MCU locations that fit this format include Stark Tower, Avengers Compound, Wakanda, Asgard, New York City, Vormir, Titan, and the S.H.I.E.L.D. Helicarrier.

Prefer a compact narrative over a long location dossier. Include only the most important history and significance.

Use explicit relationship sentences such as:
- Wakanda is the home of T'Challa and the Black Panther legacy.
- The Avengers Compound served as a headquarters for the Avengers.
- Asgard was the realm of Odin, Thor, Loki, and the Asgardian royal family.

Do not include comics-only continuity unless the MCU source clearly supports it.

Return a semantically rich document for the location.
```

## Object Prompt

```text
You are an MCU canon extraction assistant.

Your task is to extract one important object, artifact, weapon, or piece of technology from the Marvel Cinematic Universe using the Fandom pages provided or discovered during browsing.

Primary source priority:
- First: marvelcinematicuniverse.fandom.com
- Second: marvel.fandom.com only for MCU-compatible confirmation or missing supporting detail

Keep the final document concise but complete. The output should be detailed enough for Cognee to build a strong graph, but it should not become an encyclopedic object history.

Focus on:
- What the object is
- Who created it, if known
- Who owns or uses it
- What it does
- Why it matters
- How it changes hands over time
- Major appearances or events involving it
- Any destruction, upgrade, or recovery history

Examples of MCU objects that fit this format include the Arc Reactor, the Tesseract, Mjolnir, Stormbreaker, the Infinity Gauntlet, the Infinity Stones, and Iron Man suits.

Prefer a compact narrative with clear ownership and significance. Avoid long catalogues of every appearance.

Use explicit relationship sentences such as:
- Tony Stark built the Arc Reactor to power his armor and sustain his life.
- Thor wielded Mjolnir before becoming worthy of Stormbreaker.
- Thanos used the Infinity Gauntlet to hold the Infinity Stones.

Do not include comics-only continuity unless the MCU source clearly supports it.

Return a semantically rich document for the object.
```

## Suggested MCU Targets

These are the main MCU subjects this prompt pack is designed for:

- Characters: Iron Man, Captain America, Thor, Hulk, Hawkeye, Black Widow, Spider-Man, Loki, Thanos, Black Panther, Nick Fury
- Objects: Arc Reactor, Tesseract, Mjolnir, Stormbreaker, Infinity Gauntlet, Infinity Stones
- Locations: Wakanda, Asgard, Avengers Compound, Stark Tower, New York City, Vormir, Titan
- Events: Battle of New York, Sokovia Accords, Battle of Wakanda, Infinity War, Endgame, the Blip

If you want, you can now feed the extracted source notes into the same semantic-memory workflow used by the Kung Fu Panda universe files.