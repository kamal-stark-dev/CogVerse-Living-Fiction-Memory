import { useEffect, useState, useCallback } from "react";
import { fetchCharacterGraph } from "../api";
import { getTheme } from "../utils/themes";

const DEFAULT_NODE_COUNT = 8;
const MAX_NODE_COUNT = 12;

// Determines the best text-anchor and label offset for a node at a given angle,
// so labels are always pushed outward away from the center rather than overlapping the node circle.
function getLabelAnchor(angle) {
  const deg = ((angle * 180) / Math.PI + 360) % 360;
  if (deg > 30 && deg < 150) return { anchor: "middle", dy: 18 };   // bottom arc
  if (deg > 210 && deg < 330) return { anchor: "middle", dy: -12 };  // top arc
  if (deg >= 150 && deg <= 210) return { anchor: "end", dy: 4 };     // left
  return { anchor: "start", dy: 4 };                                 // right
}

// Extra offset multiplier to push the label text beyond the node circle.
function getLabelPos(x, y, cx, cy, nodeR) {
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const factor = (dist + nodeR + 10) / dist;
  return { lx: cx + dx * factor, ly: cy + dy * factor };
}

export default function RelationshipGraph({ universe, character }) {
  const [edges, setEdges] = useState(null);
  const [error, setError] = useState(null);
  const [nodeCount, setNodeCount] = useState(DEFAULT_NODE_COUNT);
  const [selected, setSelected] = useState(null); // {name, relation, direction}

  useEffect(() => {
    setEdges(null);
    setError(null);
    setNodeCount(DEFAULT_NODE_COUNT);
    setSelected(null);
    fetchCharacterGraph(universe, character)
      .then((data) => setEdges(data.edges))
      .catch((e) => setError(e.message));
  }, [universe, character]);

  const handleNodeClick = useCallback((node) => {
    setSelected((prev) => (prev?.name === node.name ? null : node));
  }, []);

  if (error)
    return <div className="graph-panel-empty">Couldn't load the memory graph: {error}</div>;
  if (edges === null)
    return <div className="graph-panel-empty">Loading memory graph…</div>;
  if (edges.length === 0)
    return (
      <div className="graph-panel-empty">
        No relationships extracted for {character} yet — check that cognify has run for this universe.
      </div>
    );

  const accent = getTheme(universe).accent;

  const allRelatedNames = [...new Set(edges.map((e) => e.other))];
  const cappedMax = Math.min(allRelatedNames.length, MAX_NODE_COUNT);
  const minNodes = Math.min(3, allRelatedNames.length);
  const activeCount = Math.min(nodeCount, cappedMax);
  const relatedNames = allRelatedNames.slice(0, activeCount);

  // SVG canvas dimensions
  const W = 600;
  const H = 380;
  const cx = W / 2;
  const cy = H / 2;
  const radius = 145;
  const centerR = 38;
  const nodeR = 26;

  const positioned = relatedNames.map((name, i) => {
    const angle = (2 * Math.PI * i) / relatedNames.length - Math.PI / 2;
    const edgeData = edges.find((e) => e.other === name);
    return {
      name,
      relation: edgeData?.relation ?? "related to",
      direction: edgeData?.direction ?? "out",
      angle,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  const truncate = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

  // Build a smooth quadratic bezier path from center to node
  function edgePath(node) {
    // Slight perpendicular offset for a gentle curve
    const mx = (cx + node.x) / 2;
    const my = (cy + node.y) / 2;
    const perpX = -(node.y - cy) * 0.12;
    const perpY = (node.x - cx) * 0.12;
    return `M ${cx} ${cy} Q ${mx + perpX} ${my + perpY} ${node.x} ${node.y}`;
  }

  return (
    <div className="graph-panel">
      {/* Controls row */}
      {allRelatedNames.length > minNodes && (
        <div className="graph-controls">
          <span className="graph-count-badge">
            {activeCount} / {allRelatedNames.length} connections
          </span>
          <input
            id="node-count"
            type="range"
            min={minNodes}
            max={cappedMax}
            value={activeCount}
            onChange={(e) => {
              setNodeCount(Number(e.target.value));
              setSelected(null);
            }}
          />
        </div>
      )}

      <div className="graph-canvas-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="graph-svg">
          <defs>
            {/* Radial glow for center node */}
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
              <stop offset="100%" stopColor={accent} stopOpacity="0.3" />
            </radialGradient>
            {/* Glow filter for edges */}
            <filter id="edgeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Node hover glow */}
            <filter id="nodeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Arrowhead marker */}
            <marker
              id="arrow"
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <path d="M 0 0 L 6 3 L 0 6 Z" fill={accent} fillOpacity="0.55" />
            </marker>
          </defs>

          {/* Subtle background grid ring */}
          <circle
            cx={cx} cy={cy} r={radius + 10}
            fill="none"
            stroke={accent}
            strokeOpacity="0.05"
            strokeWidth="60"
          />
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={accent}
            strokeOpacity="0.08"
            strokeWidth="1"
            strokeDasharray="4 6"
          />

          {/* Edge paths */}
          {positioned.map((node, i) => (
            <path
              key={`edge-${i}`}
              d={edgePath(node)}
              fill="none"
              stroke={selected?.name === node.name ? accent : accent}
              strokeOpacity={selected?.name === node.name ? 0.85 : 0.3}
              strokeWidth={selected?.name === node.name ? 2 : 1.2}
              markerEnd="url(#arrow)"
              filter={selected?.name === node.name ? "url(#edgeGlow)" : undefined}
              className="graph-edge"
            />
          ))}

          {/* Relation labels on edge midpoints */}
          {positioned.map((node, i) => {
            const mx = (cx + node.x) / 2;
            const my = (cy + node.y) / 2;
            const perpX = -(node.y - cy) * 0.12;
            const perpY = (node.x - cx) * 0.12;
            const isSelected = selected?.name === node.name;
            return (
              <text
                key={`rel-${i}`}
                x={mx + perpX}
                y={my + perpY - 5}
                textAnchor="middle"
                className="graph-relation-label"
                opacity={isSelected ? 1 : 0.45}
                style={{ fontWeight: isSelected ? 600 : 400 }}
              >
                {truncate(node.relation, 18)}
              </text>
            );
          })}

          {/* Center node — glowing, with character name */}
          <circle cx={cx} cy={cy} r={centerR + 10} fill={accent} fillOpacity="0.12" />
          <circle cx={cx} cy={cy} r={centerR} fill="url(#centerGlow)" />
          <circle cx={cx} cy={cy} r={centerR} fill="none" stroke={accent} strokeWidth="1.5" strokeOpacity="0.6" />
          <text x={cx} y={cy - 2} textAnchor="middle" className="graph-center-label">
            {truncate(character, 12)}
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" className="graph-center-sublabel">
            center
          </text>

          {/* Outer nodes */}
          {positioned.map((node, i) => {
            const isSelected = selected?.name === node.name;
            const { anchor, dy } = getLabelAnchor(node.angle);
            const { lx, ly } = getLabelPos(node.x, node.y, cx, cy, nodeR);
            const words = node.name.split(" ");
            const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
            const line2 = words.slice(Math.ceil(words.length / 2)).join(" ");

            return (
              <g
                key={`node-${i}`}
                onClick={() => handleNodeClick(node)}
                className="graph-node-group"
                style={{ cursor: "pointer" }}
              >
                {/* Selection / hover glow ring */}
                {isSelected && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeR + 8}
                    fill={accent}
                    fillOpacity="0.15"
                    stroke={accent}
                    strokeWidth="1"
                    strokeOpacity="0.4"
                    filter="url(#nodeGlow)"
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeR}
                  fill={isSelected ? accent : "var(--surface-raised)"}
                  fillOpacity={isSelected ? 0.2 : 1}
                  stroke={accent}
                  strokeWidth={isSelected ? 2 : 1.2}
                  strokeOpacity={isSelected ? 0.9 : 0.5}
                  className="graph-outer-circle"
                />

                {/* Initial letter inside node */}
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  className="graph-node-initial"
                  fill={isSelected ? accent : "var(--text-dim)"}
                >
                  {node.name.charAt(0)}
                </text>

                {/* Intelligent outer label — pushed beyond circle */}
                <text
                  x={lx}
                  y={ly + dy}
                  textAnchor={anchor}
                  className="graph-outer-label"
                >
                  {line2 ? (
                    <>
                      <tspan x={lx} dy="0">{line1}</tspan>
                      <tspan x={lx} dy="13">{line2}</tspan>
                    </>
                  ) : (
                    line1
                  )}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Inspection Card — appears when a node is selected */}
        {selected && (
          <div className="graph-inspect-card" key={selected.name}>
            <div className="graph-inspect-header">
              <span className="graph-inspect-initial">{selected.name.charAt(0)}</span>
              <div className="graph-inspect-meta">
                <span className="graph-inspect-name">{selected.name}</span>
                <span className="graph-inspect-universe">{universe?.replace(/_/g, " ")}</span>
              </div>
              <button
                type="button"
                className="graph-inspect-close"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="graph-inspect-body">
              <div className="graph-inspect-row">
                <span className="graph-inspect-lbl">Relationship</span>
                <span className="graph-inspect-val">{selected.relation}</span>
              </div>
              <div className="graph-inspect-row">
                <span className="graph-inspect-lbl">Direction</span>
                <span className="graph-inspect-val graph-inspect-dir">
                  {selected.direction === "out"
                    ? `${character} → ${selected.name}`
                    : `${selected.name} → ${character}`}
                </span>
              </div>
            </div>
            <div className="graph-inspect-footer">
              Click another node to inspect · click again to dismiss
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
