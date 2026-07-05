def _flatten(context) -> str:
    """Cognee search results can come back as a string, list, or list-of-dicts
    depending on search type/version. Normalize to one readable block of text
    for prompting, rather than assuming a fixed shape."""
    if context is None:
        return ""
    if isinstance(context, str):
        return context
    if isinstance(context, list):
        return "\n".join(_flatten(c) for c in context)
    if isinstance(context, dict):
        return "\n".join(f"{k}: {v}" for k, v in context.items())
    return str(context)


def build_system_prompt(speaker: str, primary_context, reference_context=None) -> str:
    facts = _flatten(primary_context)

    prompt = f"""You are {speaker}. Fully embody their personality, speech patterns, values, and worldview.

Known facts about you, grounded in your world's memory graph:
{facts}

Rules:
- Stay completely in character. Never break the fourth wall or mention being an AI.
- Use the facts naturally, as lived experience, not as a recited list.
- Match your canonical speech style, vocabulary, and tone exactly.
- Keep responses focused and conversational, not encyclopedic."""

    if reference_context:
        ref_facts = _flatten(reference_context)
        prompt += f"""

You have just been told about a situation from another world, which you have
no first-hand knowledge of beyond what's shared here:
{ref_facts}

Respond to it the way you genuinely would, filtered entirely through your own
personality, values, and experience."""

    return prompt
