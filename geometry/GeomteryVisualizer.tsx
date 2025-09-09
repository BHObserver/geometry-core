// components/geometry/GeometryVisualizer.tsx
"use client";

import React, { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { theorems, Theorem, Point, Line, Polygon, Marker } from "./data/theorems";
import * as geom from "./utils/geometry";

type Props = { theoremId: string; width?: number; height?: number };

export default function GeometryVisualizer({ theoremId, width = 720, height = 480 }: Props) {
  const theorem: Theorem | undefined = useMemo(() => theorems.find((t) => t.id === theoremId), [theoremId]);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  if (!theorem) return <div className="p-4 text-red-600">Unknown theorem: {theoremId}</div>;

  const { steps } = theorem;

  // memoize setup
  const { points, lines = [], polygons = [], markers = [], diagnostics = [], visibility, circle } = useMemo(
    () => theorem.setup(width, height),
    [theorem, width, height]
  );

  const step = steps[stepIndex];

  // check show logic: visible either by visibility mapping (appears on/after its step) or explicitly included in current step.show
  const show = useCallback(
    (id: string) => {
      // explicit show for current step
      if (step?.show?.includes(id)) return true;
      const appearStep = visibility[id];
      if (!appearStep) return false;
      const appearIndex = steps.findIndex((s) => s.id === appearStep);
      return stepIndex >= appearIndex;
    },
    [visibility, stepIndex, steps, step]
  );

  const isHighlighted = (id: string) => {
    return !!step?.highlight?.includes(id);
  };

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

  // compute diagnostic values on demand
  const computeDiagnostics = () => {
    const out: { label: string; value: string }[] = [];

    // example: lengths OA, OC, OE, OF (if present)
    const pO = points.find((p) => p.id === "O");
    if (pO) {
      ["A", "B", "C", "D", "E", "F"].forEach((id) => {
        const p = points.find((pt) => pt.id === id);
        if (p) {
          out.push({ label: `|O${id}|`, value: `${geom.dist(pO, p).toFixed(2)} px` });
        }
      });
    }

    // example angles: angle AOE if points exist
    const A = points.find((p) => p.id === "A");
    const C = points.find((p) => p.id === "C");
    const E = points.find((p) => p.id === "E");
    const F = points.find((p) => p.id === "F");
    if (A && E && pO) out.push({ label: "∠AOE", value: `${(geom.angleBetween(A, pO, E) * (180 / Math.PI)).toFixed(1)}°` });
    if (C && F && pO) out.push({ label: "∠COF", value: `${(geom.angleBetween(C, pO, F) * (180 / Math.PI)).toFixed(1)}°` });

    return out;
  };

  // Framer variants
  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
    highlight: (custom: any) => ({
      pathLength: 1,
      opacity: 1,
      strokeWidth: (custom?.width ?? 2) + 2,
      stroke: "#f97316",
      scale: [1, 1.05, 1],
      transition: { duration: 0.8, repeat: 1, repeatType: "mirror" },
    }),
  };

  const polyVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.9 },
    highlight: { opacity: 0.95, scale: [1, 1.03, 1], transition: { duration: 0.7, repeat: 1 } },
  };

  const pointVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    highlight: { scale: [1, 1.5, 1], transition: { duration: 0.8, repeat: 1 } },
  };

  // helper to find point
  const find = (id: string): Point | undefined => points.find((p) => p.id === id);

  // on element click: open modal with info
  const onElementClick = (id: string) => {
    setSelectedElement(id);
  };

  // annotation rendering
  const renderAnnotation = (ann: { id: string; text: string; dx?: number; dy?: number }) => {
    const p = find(ann.id);
    if (!p) return null;
    const x = p.x + (ann.dx ?? 12);
    const y = p.y + (ann.dy ?? -14);
    return (
      <g key={`ann-${ann.id}`}>
        <rect x={x - 6} y={y - 16} rx={6} ry={6} width={(ann.text.length * 7) + 12} height={22} fill="#ffffff" stroke="#e6e6e6" />
        <text x={x} y={y} fontSize={12} fill="#0f172a" fontWeight={600}>
          {ann.text}
        </text>
      </g>
    );
  };

  // right-angle marker rendering using geometry util (we will compute neighbors)
  const renderRightAngle = (m: Marker) => {
    if (m.type !== "rightangle") return null;
    const at = find(m.at);
    if (!at) return null;
    // find two nearest points (this is heuristic: choose two points that form triangle containing at)
    // prefer points that are connected to the marker by polygons/lines present
    // fallback: choose two points offset
    const candidates = points.filter((p) => p.id !== at.id);
    if (candidates.length < 2) return null;
    // pick two nearest
    candidates.sort((a, b) => geom.dist(a, at) - geom.dist(b, at));
    const p1 = candidates[0];
    const p2 = candidates[1];
    const sq = geom.rightAngleSquare(at, p1, p2, m.size ?? 12);
    const pts = sq.map((pt) => `${pt.x},${pt.y}`).join(" ");
    return <polygon key={m.id} points={pts} fill="none" stroke={m.color || "#064e3b"} strokeWidth={2} />;
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-2">{theorem.title}</h2>
      <p className="text-sm text-slate-600 mb-4">{theorem.statement}</p>

      <div className="bg-white rounded-2xl shadow p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Canvas */}
        <div className="col-span-2">
          <div className="border rounded-lg relative overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="xMidYMid meet">
              {/* Circle */}
              {lines
                .filter((l) => l.type === "circle")
                .map((l) => {
                  const O = points.find((p) => p.id === l.from)!;
                  const R = circle?.r ?? 150;
                  if (!show(l.id)) return null;
                  const highlighted = isHighlighted(l.id);
                  return (
                    <motion.circle
                      key={l.id + "-" + replayKey}
                      cx={O.x}
                      cy={O.y}
                      r={R}
                      fill="none"
                      stroke={highlighted ? "#f97316" : "#60a5fa"}
                      strokeWidth={highlighted ? 3.6 : 2.5}
                      initial="hidden"
                      animate={highlighted ? "highlight" : "visible"}
                      variants={lineVariants}
                      onClick={() => onElementClick(l.id)}
                      style={{ cursor: "pointer" }}
                    />
                  );
                })}

              {/* Polygons (areas) */}
              {polygons.map((poly) => {
                if (!show(poly.id)) return null;
                const pts = poly.points.map((id) => {
                  const p = find(id)!;
                  return `${p.x},${p.y}`;
                }).join(" ");
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
                .filter((l) => l.type !== "circle")
                .map((l) => {
                  if (!show(l.id)) return null;
                  const P = find(l.from)!;
                  const Q = find(l.to)!;
                  const highlighted = isHighlighted(l.id);
                  return (
                    <motion.line
                      key={l.id + "-" + replayKey}
                      x1={P.x}
                      y1={P.y}
                      x2={Q.x}
                      y2={Q.y}
                      stroke={highlighted ? "#f97316" : (l.color || "#111827")}
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
                  <text key={`${p.id}-label`} x={p.x + 10} y={p.y - 10} fontSize={14} fontWeight={600} fill="#111827">
                    {p.label}
                  </text>
                ) : null
              )}

              {/* Markers */}
              {markers.map((m) => (show(m.id) ? renderRightAngle(m) : null))}

              {/* Annotations for current step */}
              {step?.annotation?.map((a) => renderAnnotation(a))}
            </svg>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 mt-3">
            <button onClick={prev} className="px-3 py-1 rounded bg-slate-100 border">Prev</button>
            <button onClick={next} className="px-3 py-1 rounded bg-slate-100 border">Next</button>
            <button onClick={reset} className="px-3 py-1 rounded bg-red-50 border text-red-600">Reset</button>
            <button onClick={replay} className="px-3 py-1 rounded bg-amber-50 border text-amber-700">Replay</button>

            <div className="ml-4 text-sm text-slate-700">
              Step {stepIndex + 1} / {steps.length} — {steps[stepIndex].label}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <label className="text-xs text-slate-600 mr-2">Diagnostics</label>
              <button onClick={() => setDiagnosticsOpen((v) => !v)} className="px-2 py-1 rounded bg-slate-50 border text-sm">
                {diagnosticsOpen ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-1">
          <div className="space-y-2">
            <div className="text-sm font-semibold">Steps</div>
            <div className="bg-slate-50 rounded p-2 space-y-1">
              {steps.map((s, i) => (
                <div key={s.id} className={`text-sm px-2 py-1 rounded ${i === stepIndex ? "bg-white shadow" : ""}`}>
                  <div className="font-medium">{i + 1}. {s.label}</div>
                  {i === stepIndex && s.annotation?.map((a) => (
                    <div key={a.id} className="text-xs text-slate-500">{a.text}</div>
                  ))}
                </div>
              ))}
            </div>

            {diagnosticsOpen && (
              <div className="mt-3 text-sm">
                <div className="font-semibold">Diagnostics</div>
                {computeDiagnostics().map((d, i) => (
                  <div key={i} className="text-xs text-slate-600">{d.label}: {d.value}</div>
                ))}
                <div className="text-xs text-emerald-700 mt-2">(Useful for verifying perpendiculars / equal lengths)</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for selected element */}
      {selectedElement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedElement(null)} />
          <div className="relative bg-white rounded-lg shadow-lg p-4 w-96">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">Element: {selectedElement}</div>
              <button className="text-sm text-slate-500" onClick={() => setSelectedElement(null)}>Close</button>
            </div>
            <div className="text-sm text-slate-700">
              <p>This is an interactive explanation area for <strong>{selectedElement}</strong>. You can:</p>
              <ul className="list-disc ml-5 mt-2 text-xs text-slate-600">
                <li>See diagnostics related to this element (length/angle)</li>
                <li>Replay the micro-animation for this step</li>
              </ul>

              <div className="mt-3">
                <button onClick={() => { replay(); }} className="px-3 py-1 rounded bg-slate-100 border mr-2">Replay Animation</button>
                <button onClick={() => setSelectedElement(null)} className="px-3 py-1 rounded bg-red-50 border text-red-600">Close</button>
              </div>

              <div className="mt-3 text-xs text-slate-600">
                {/* Simple contextual diagnostics */}
                {(() => {
                  const p = points.find((pt) => pt.id === selectedElement);
                  if (p) {
                    const O = points.find((pt) => pt.id === "O");
                    return O ? <div>Distance to O: {geom.dist(O, p).toFixed(2)} px</div> : null;
                  }
                  const line = lines.find((l) => l.id === selectedElement);
                  if (line) {
                    const A = points.find((pt) => pt.id === line.from)!;
                    const B = points.find((pt) => pt.id === line.to)!;
                    return <div>Length: {geom.dist(A, B).toFixed(2)} px</div>;
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
