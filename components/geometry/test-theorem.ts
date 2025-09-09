// components/geometry/test-theorem.ts
// Example of how easy it is to add a new theorem using the geometry core

import { point } from '../../primitives/Point';
import { midpoint } from '../../ops/constructions';
import { distance, angleAt } from '../../ops/measures';
import { toDeg } from '../../math/numeric';
import { Theorem } from './theorems';

// Helper functions (reused from theorems.ts)
const createPoint = (x: number, y: number, id: string, label?: string, color?: string, radius = 5) => ({
  id, x, y, label, color, radius
});

const createLine = (fromId: string, toId: string, id: string, color?: string, width?: number, dasharray?: string) => ({
  id, from: fromId, to: toId, color, width, dasharray
});

const createCircle = (centerId: string, id: string, color?: string, width?: number) => ({
  id, from: centerId, to: centerId, color, width
});

// Example: Simple Triangle Midpoint Theorem
export const triangleMidpointTheorem: Theorem = {
  id: "triangle-midpoint",
  title: "Triangle Midpoint Theorem",
  statement: "The line segment joining the midpoints of two sides of a triangle is parallel to the third side and half its length.",
  steps: [
    { id: "triangle", label: "Draw triangle ABC", highlight: ["A", "B", "C", "AB", "BC", "CA"] },
    { id: "midpoints", label: "Mark midpoints D and E of AB and AC", highlight: ["D", "E"], annotation: [{ id: "D", text: "Midpoint D" }, { id: "E", text: "Midpoint E" }] },
    { id: "connector", label: "Draw line DE", highlight: ["DE"], annotation: [{ id: "DE", text: "DE" }] },
    { id: "parallel", label: "DE is parallel to BC", highlight: ["DE", "BC"] },
    { id: "length", label: "DE = ½ BC", highlight: ["DE", "BC"] },
  ],
  setup: (width, height) => {
    const CX = width / 2;
    const CY = height / 2;
    
    // Create triangle vertices
    const A = createPoint(CX, CY - 80, "A", "A", "#ef4444", 5);
    const B = createPoint(CX - 100, CY + 60, "B", "B", "#ef4444", 5);
    const C = createPoint(CX + 100, CY + 60, "C", "C", "#ef4444", 5);
    
    // Use geometry core for midpoint calculations
    const coreA = point(A.x, A.y, 'A' as any);
    const coreB = point(B.x, B.y, 'B' as any);
    const coreC = point(C.x, C.y, 'C' as any);
    
    const coreD = midpoint(coreA, coreB);
    const coreE = midpoint(coreA, coreC);
    
    const D = createPoint(coreD.x, coreD.y, "D", "D", "#10b981", 5);
    const E = createPoint(coreE.x, coreE.y, "E", "E", "#10b981", 5);
    
    const points = [A, B, C, D, E];
    
    const lines = [
      createLine("A", "B", "AB", "#1f2937", 3),
      createLine("B", "C", "BC", "#1f2937", 3),
      createLine("C", "A", "CA", "#1f2937", 3),
      createLine("D", "E", "DE", "#f97316", 2.5, "6 4"),
    ];
    
    const polygons = [
      { id: "ABC", points: ["A", "B", "C"], color: "#fef3c7", opacity: 0.8 },
    ];
    
    // Generate diagnostics using geometry core
    const diagnostics = [
      { label: "|DE|", value: `${distance(coreD, coreE).toFixed(2)} px` },
      { label: "|BC|", value: `${distance(coreB, coreC).toFixed(2)} px` },
      { label: "|DE|/|BC|", value: `${(distance(coreD, coreE) / distance(coreB, coreC)).toFixed(3)}` },
      { label: "∠ADE", value: `${toDeg(angleAt(coreA, coreD, coreE)).toFixed(1)}°` },
      { label: "∠ABC", value: `${toDeg(angleAt(coreA, coreB, coreC)).toFixed(1)}°` },
    ];
    
    const visibility = {
      A: "triangle", B: "triangle", C: "triangle",
      AB: "triangle", BC: "triangle", CA: "triangle",
      D: "midpoints", E: "midpoints",
      DE: "connector",
      ABC: "triangle",
    };
    
    return {
      points,
      lines,
      polygons,
      diagnostics,
      visibility,
    };
  },
};

// To add this theorem to the system, simply add it to the theorems array in theorems.ts:
// export const theorems: Theorem[] = [chordMidpointTheorem, equalChordsTheorem, triangleMidpointTheorem];
