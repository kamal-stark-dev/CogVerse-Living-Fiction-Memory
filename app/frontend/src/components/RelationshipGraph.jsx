import { useEffect, useState } from "react";
import { fetchCharacterGraph } from "../api";
import { getTheme } from "../utils/themes";

const DEFAULT_NODE_COUNT = 8;
const MAX_NODE_COUNT = 12;

export default function RelationshipGraph({ universe, character }) {
  const [edges, setEdges] = useState(null);
  const [error, setError] = useState(null);
  const [nodeCount, setNodeCount] = useState(DEFAULT_NODE_COUNT);

  useEffect(() => {
    setEdges(null);
    setError(null);
    setNodeCount(DEFAULT_NODE_COUNT);
    fetchCharacterGraph(universe, character)
      .then((data) => setEdges(data.edges))
      .catch((e) => setError(e.message));
  }, [universe, character]);

  if (error) {
    return (
      <div className="graph-panel-empty">
        Couldn't load the memory graph: {error}
      </div>
    );
  }
  if (edges === null) {
    return <div className="graph-panel-empty">Loading memory graph…</div>;
  }
  if (edges.length === 0) {
    return (
      <div className="graph-panel-empty">
        No relationships extracted for {character} yet — check that cognify has
        run for this universe.
      </div>
    );
  }

  const accent = getTheme(universe).accent;

  const allRelatedNames = [...new Set(edges.map((e) => e.other))];
  const cappedMax = Math.min(allRelatedNames.length, MAX_NODE_COUNT);
  const minNodes = Math.min(3, allRelatedNames.length);
  const activeCount = Math.min(nodeCount, cappedMax);
  const relatedNames = allRelatedNames.slice(0, activeCount);

  const cx = 200;
  const cy = 160;
  const radius = 120;

  const positioned = relatedNames.map((name, i) => {
    const angle = (2 * Math.PI * i) / relatedNames.length - Math.PI / 2;
    return {
      name,
      relation: edges.find((e) => e.other === name)?.relation ?? "related to",
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  const truncate = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

  return (
    <div className="graph-panel">
      {allRelatedNames.length > minNodes && (
        <div className="graph-controls">
          <label htmlFor="node-count">
            Showing {activeCount} of {allRelatedNames.length} relationships
          </label>
          <input
            id="node-count"
            type="range"
            min={minNodes}
            max={cappedMax}
            value={activeCount}
            onChange={(e) => setNodeCount(Number(e.target.value))}
          />
        </div>
      )}

      <svg viewBox="0 0 400 320" className="graph-svg">
        {positioned.map((node, i) => (
          <line
            key={`line-${i}`}
            x1={cx}
            y1={cy}
            x2={node.x}
            y2={node.y}
            stroke={accent}
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
        ))}

        {positioned.map((node, i) => {
          const midX = (cx + node.x) / 2;
          const midY = (cy + node.y) / 2;
          return (
            <text
              key={`rel-${i}`}
              x={midX}
              y={midY}
              textAnchor="middle"
              className="graph-relation-label"
            >
              {truncate(node.relation, 16)}
            </text>
          );
        })}

        <circle cx={cx} cy={cy} r={32} fill={accent} />
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          className="graph-center-label"
        >
          {truncate(character, 14)}
        </text>

        {positioned.map((node, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r={22}
              fill="var(--surface-raised)"
              stroke={accent}
              strokeWidth="1.5"
            />
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              className="graph-node-label"
            >
              {truncate(node.name, 12)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
