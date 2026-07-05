import re

# Matches lines like:
#   tony stark --[child_of]--> howard stark  (Tony Stark is the son of Howard Stark.)
CONNECTION_PATTERN = re.compile(
    r'^(?P<source>.+?)\s*--\[(?P<relation>[^\]]+)\]-->\s*(?P<target>.+?)(?:\s*\(.*\))?$'
)


def _titlecase(s: str) -> str:
    return " ".join(w.capitalize() for w in s.split())


def parse_graph_context(raw, character: str) -> list[dict]:
    """Parses cognee.search(SearchType.GRAPH_COMPLETION, only_context=True, ...)
    output into a list of {source, target, relation, other, direction} dicts,
    centered on the queried `character`.

    Real Cognee Cloud output (as of testing) is a list of dicts, one per
    dataset searched, each with a `search_result` string containing a
    "Nodes:" section and a "Connections:" section. Only the Connections
    section is used here -- that's where the actual relationship triples
    live, formatted as `source --[relation]--> target  (explanation)`.
    """
    edges = []
    if not raw:
        return edges

    character_norm = character.strip().lower()

    for entry in raw:
        text = entry.get("search_result") if isinstance(entry, dict) else str(entry)
        if not text:
            continue

        # Only the Connections section has actual relationship triples --
        # the Nodes section is just entity descriptions, not edges.
        _, _, connections_block = text.partition("Connections:")
        if not connections_block:
            connections_block = text

        for line in connections_block.splitlines():
            line = line.strip()
            if not line or "-->" not in line:
                continue

            match = CONNECTION_PATTERN.match(line)
            if not match:
                continue

            source = match.group("source").strip()
            relation = match.group("relation").strip()
            target = match.group("target").strip()

            # Skip noisy document-chunk pseudo-nodes (e.g. "document_type:
            # character primary_entity: ... [tony, stark, stark's]") --
            # these are chunk references Cognee uses internally, not
            # meaningful character/entity relationships to visualize.
            if source.startswith("document_type:") or target.startswith("document_type:"):
                continue

            source_norm = source.lower()
            target_norm = target.lower()

            # The queried character can appear as EITHER side of the edge
            # (e.g. "bruce banner --[ally_of]--> tony stark" has Tony as the
            # target, not the source). Normalize so `other` is always
            # whichever side ISN'T the character, regardless of direction.
            if character_norm in source_norm:
                other, direction = target, "out"
            elif character_norm in target_norm:
                other, direction = source, "in"
            else:
                # Neither side mentions the queried character -- this is a
                # relationship between two other entities that happened to
                # get pulled into context. Not useful for a character-
                # centered graph, so skip it.
                continue

            edges.append(
                {
                    "source": character if direction == "out" else other,
                    "target": other if direction == "out" else character,
                    "relation": relation.replace("_", " "),
                    "other": _titlecase(other),
                    "direction": direction,
                }
            )

    return edges
