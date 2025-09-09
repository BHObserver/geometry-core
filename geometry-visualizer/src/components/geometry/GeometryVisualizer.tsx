// components/geometry/GeometryVisualizer.tsx
"use client";

import React, { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { theorems, Theorem, Point, Line, Polygon, Marker } from "./theorems";

type Props = { 
  theoremId: string; 
  width?: number; 
  height?: number; 
};

export default function GeometryVisualizer({ 
  theoremId, 
  width = 720, 
  height = 480 
}: Props) {
  const theorem: Theorem | undefined = useMemo(
    () => theorems.find((t) => t.id === theoremId), 
    [theoremId]
  );
  
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  if (!theorem) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        Unknown theorem: {theoremId}
      </div>
    );
  }

  const { steps } = theorem;

  // Memoize setup to avoid recalculating geometry on every render
  const { 
    points, 
    lines = [], 
    polygons = [], 
    markers = [], 
    diagnostics = [], 
    visibility, 
    circle 
  } = useMemo(
    () => theorem.setup(width, height),
    [theorem, width, height]
  );

  const step = steps[stepIndex];

  // Determine visibility: element is visible when stepIndex >= indexOf(visibility[elementId])
  const show = useCallback(
    (id: string) => {
      const appearStep = visibility[id];
      if (!appearStep) return false;
      const appearIndex = steps.findIndex((s) => s.id === appearStep);
      return stepIndex >= appearIndex;
    },
    [visibility, stepIndex, steps]
  );

  const isHighlighted = (id: string) => {
    return !!step?.highlight?.includes(id);
  };

  // Navigation controls
  const next = () => setStepIndex((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStepIndex((s) => Math.max(s - 1, 0));
  const reset = () => {
    setStepIndex(0);
    setSelectedElement(null);
    setReplayKey((k) => k + 1);
  };

  const replay = () => {
    setReplayKey((k) => k + 1);
  };

  // Helper to find point by ID
  const findPoint = (id: string): Point | undefined => 
    points.find((p) => p.id === id);

  // Handle element clicks
  const onElementClick = (id: string) => {
    setSelectedElement(id);
  };

  // Render annotations for current step
  const renderAnnotation = (ann: { id: string; text: string; dx?: number; dy?: number }) => {
    const p = findPoint(ann.id);
    if (!p) return null;
    const x = p.x + (ann.dx ?? 12);
    const y = p.y + (ann.dy ?? -14);
    return (
      <g key={`ann-${ann.id}`}>
        <rect 
          x={x - 6} 
          y={y - 16} 
          rx={6} 
          ry={6} 
          width={(ann.text.length * 7) + 12} 
          height={22} 
          fill="#ffffff" 
          stroke="#e6e6e6" 
        />
        <text 
          x={x} 
          y={y} 
          fontSize={12} 
          fill="#0f172a" 
          fontWeight={600}
        >
          {ann.text}
        </text>
      </g>
    );
  };

  // Render right-angle marker
  const renderRightAngle = (m: Marker) => {
    if (m.type !== "rightangle") return null;
    const at = findPoint(m.at);
    if (!at) return null;
    
    // Find two nearest points to compute right angle square
    const candidates = points.filter((p) => p.id !== at.id);
    if (candidates.length < 2) return null;
    
    // Sort by distance and pick two nearest
    candidates.sort((a, b) => {
      const distA = Math.hypot(a.x - at.x, a.y - at.y);
      const distB = Math.hypot(b.x - at.x, b.y - at.y);
      return distA - distB;
    });
    
    const p1 = candidates[0];
    const p2 = candidates[1];
    
    // Create right angle square
    const size = m.size ?? 12;
    const v1x = p1.x - at.x;
    const v1y = p1.y - at.y;
    const v2x = p2.x - at.x;
    const v2y = p2.y - at.y;
    
    const len1 = Math.hypot(v1x, v1y) || 1;
    const len2 = Math.hypot(v2x, v2y) || 1;
    
    const u1x = v1x / len1;
    const u1y = v1y / len1;
    const u2x = v2x / len2;
    const u2y = v2y / len2;
    
    const pA = { x: at.x + u1x * size * 0.45, y: at.y + u1y * size * 0.45 };
    const pB = { x: pA.x + u2x * size * 0.45, y: pA.y + u2y * size * 0.45 };
    const pC = { x: at.x + u2x * size * 0.45, y: at.y + u2y * size * 0.45 };
    
    const pts = `${at.x},${at.y} ${pA.x},${pA.y} ${pB.x},${pB.y} ${pC.x},${pC.y}`;
    
    return (
      <polygon 
        key={m.id} 
        points={pts} 
        fill="none" 
        stroke={m.color || "#064e3b"} 
        strokeWidth={2} 
      />
    );
  };

  // Framer Motion variants for animations
  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
    highlight: (custom: any) => ({
      pathLength: 1,
      opacity: 1,
      strokeWidth: (custom?.width ?? 2) + 2,
      stroke: "#fbbf24",
      scale: [1, 1.05, 1],
      transition: { duration: 0.8, repeat: 1, repeatType: "mirror" },
    }),
  };

  const polyVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.9 },
    highlight: { 
      opacity: 0.95, 
      scale: [1, 1.03, 1], 
      transition: { duration: 0.7, repeat: 1 } 
    },
  };

  const pointVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    highlight: { 
      scale: [1, 1.5, 1], 
      transition: { duration: 0.8, repeat: 1 } 
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{theorem.title}</h2>
        <p className="text-gray-600">{theorem.statement}</p>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg relative overflow-hidden border-2 border-gray-700">
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              width="100%" 
              height={height} 
              preserveAspectRatio="xMidYMid meet"
              className="bg-gray-800"
            >
              {/* Circle */}
              {lines
                .filter((l) => l.from === l.to)
                .map((l) => {
                  const center = findPoint(l.from);
                  if (!center || !show(l.id)) return null;
                  const highlighted = isHighlighted(l.id);
                  const radius = circle?.r ?? 150;
                  
                  return (
                    <motion.circle
                      key={l.id + "-" + replayKey}
                      cx={center.x}
                      cy={center.y}
                      r={radius}
                      fill="none"
                      stroke={highlighted ? "#fbbf24" : "#60a5fa"}
                      strokeWidth={highlighted ? 3.6 : 2.5}
                      initial="hidden"
                      animate={highlighted ? "highlight" : "visible"}
                      variants={lineVariants}
                      onClick={() => onElementClick(l.id)}
                      style={{ cursor: "pointer" }}
                    />
                  );
                })}

              {/* Polygons */}
              {polygons.map((poly) => {
                if (!show(poly.id)) return null;
                const pts = poly.points
                  .map((id) => {
                    const p = findPoint(id);
                    return p ? `${p.x},${p.y}` : "0,0";
                  })
                  .join(" ");
                const highlighted = isHighlighted(poly.id);
                
                return (
                  <motion.polygon
                    key={poly.id + "-" + replayKey}
                    points={pts}
                    fill={poly.color || "#ccc"}
                    opacity={poly.opacity ?? 0.6}
                    initial="hidden"
                    animate={highlighted ? "highlight" : "visible"}
                    variants={polyVariants}
                    onClick={() => onElementClick(poly.id)}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}

              {/* Lines */}
              {lines
                .filter((l) => l.from !== l.to)
                .map((l) => {
                  if (!show(l.id)) return null;
                  const from = findPoint(l.from);
                  const to = findPoint(l.to);
                  if (!from || !to) return null;
                  
                  const highlighted = isHighlighted(l.id);
                  
                  return (
                    <motion.line
                      key={l.id + "-" + replayKey}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={highlighted ? "#fbbf24" : (l.color || "#111827")}
                      strokeWidth={highlighted ? ((l.width || 2) + 2) : (l.width || 2)}
                      strokeDasharray={l.dasharray}
                      initial="hidden"
                      animate={highlighted ? "highlight" : "visible"}
                      variants={lineVariants}
                      custom={{ width: l.width }}
                      onClick={() => onElementClick(l.id)}
                      style={{ cursor: "pointer" }}
                    />
                  );
                })}

              {/* Points */}
              {points.map((p) => {
                if (!show(p.id)) return null;
                const highlighted = isHighlighted(p.id);
                
                return (
                  <motion.circle
                    key={p.id + "-" + replayKey}
                    cx={p.x}
                    cy={p.y}
                    r={highlighted ? ((p.radius ?? 5) + 2) : (p.radius ?? 5)}
                    fill={p.color || "#000"}
                    initial="hidden"
                    animate={highlighted ? "highlight" : "visible"}
                    variants={pointVariants}
                    onClick={() => onElementClick(p.id)}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}

              {/* Labels */}
              {points.map((p) =>
                show(p.id) && p.label ? (
                  <text 
                    key={`${p.id}-label`} 
                    x={p.x + 10} 
                    y={p.y - 10} 
                    fontSize={14} 
                    fontWeight={600} 
                    fill="#fbbf24"
                  >
                    {p.label}
                  </text>
                ) : null
              )}

              {/* Markers */}
              {markers.map((m) => (show(m.id) ? renderRightAngle(m) : null))}

              {/* Annotations */}
              {step?.annotation?.map((a) => renderAnnotation(a))}
            </svg>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-4">
            <button 
              onClick={prev} 
              className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              Prev
            </button>
            <button 
              onClick={next} 
              className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              Next
            </button>
            <button 
              onClick={reset} 
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Reset
            </button>
            <button 
              onClick={replay} 
              className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
            >
              Replay
            </button>

            <div className="ml-4 text-sm text-gray-300">
              Step {stepIndex + 1} / {steps.length} — {step?.label || "No step"}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <label className="text-xs text-gray-400 mr-2">Diagnostics</label>
              <button 
                onClick={() => setDiagnosticsOpen((v) => !v)} 
                className="px-3 py-1 rounded bg-gray-700 text-white text-sm hover:bg-gray-600 transition-colors"
              >
                {diagnosticsOpen ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            {/* Steps */}
            <div>
              <div className="text-sm font-semibold text-gray-300 mb-2">Steps</div>
              <div className="bg-gray-800 rounded-lg p-3 space-y-2">
                {steps.map((s, i) => (
                  <div 
                    key={s.id} 
                    className={`text-sm px-3 py-2 rounded ${
                      i === stepIndex 
                        ? "bg-gray-700 text-white shadow-lg" 
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    <div className="font-medium">
                      {i + 1}. {s.label}
                    </div>
                    {i === stepIndex && s.annotation?.map((a) => (
                      <div key={a.id} className="text-xs text-gray-400 mt-1">
                        {a.text}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostics */}
            {diagnosticsOpen && (
              <div className="text-sm">
                <div className="font-semibold text-gray-300 mb-2">Diagnostics</div>
                <div className="bg-gray-800 rounded-lg p-3 space-y-2">
                  {diagnostics.map((d, i) => (
                    <div key={i} className="text-xs text-gray-400 flex justify-between">
                      <span>{d.label}:</span>
                      <span className="text-gray-300">{d.value}</span>
                    </div>
                  ))}
                  <div className="text-xs text-emerald-400 mt-2">
                    (Useful for verifying perpendiculars / equal lengths)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for selected element */}
      {selectedElement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/60" 
            onClick={() => setSelectedElement(null)} 
          />
          <div className="relative bg-gray-800 rounded-lg shadow-lg p-6 w-96 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <div className="font-semibold text-white">Element: {selectedElement}</div>
              <button 
                className="text-sm text-gray-400 hover:text-white" 
                onClick={() => setSelectedElement(null)}
              >
                Close
              </button>
            </div>
            <div className="text-sm text-gray-300">
              <p>Interactive explanation for <strong className="text-white">{selectedElement}</strong>:</p>
              <ul className="list-disc ml-5 mt-2 text-xs text-gray-400">
                <li>See diagnostics related to this element</li>
                <li>Replay the animation for this step</li>
              </ul>

              <div className="mt-4">
                <button 
                  onClick={() => { replay(); }} 
                  className="px-3 py-1 rounded bg-gray-700 text-white mr-2 hover:bg-gray-600 transition-colors"
                >
                  Replay Animation
                </button>
                <button 
                  onClick={() => setSelectedElement(null)} 
                  className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>  
  );
}
