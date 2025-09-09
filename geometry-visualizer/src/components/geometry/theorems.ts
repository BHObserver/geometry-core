// components/geometry/theorems.ts
import { point } from '../../primitives/Point';
import { midpoint, perpendicularBisector } from '../../ops/constructions';
import { distance, angleAt } from '../../ops/measures';
import { toDeg } from '../../math/numeric';

// Core types - simplified and focused
export type Point = { 
  id: string; 
  x: number; 
  y: number; 
  label?: string; 
  color?: string; 
  radius?: number 
};

export type Line = { 
  id: string; 
  from: string; 
  to: string; 
  color?: string; 
  width?: number; 
  dasharray?: string 
};

export type Polygon = { 
  id: string; 
  points: string[]; 
  color?: string; 
  opacity?: number 
};

export type Marker = { 
  id: string; 
  type: "rightangle"; 
  at: string; 
  size?: number; 
  color?: string 
};

export type Diagnostic = { 
  label: string; 
  value: string 
};

export type Step = { 
  id: string; 
  label: string; 
  highlight?: string[];
  annotation?: { id: string; text: string; dx?: number; dy?: number }[];
};

export type Theorem = { 
  id: string; 
  title: string; 
  statement: string; 
  steps: Step[]; 
  setup: (width: number, height: number) => {
    points: Point[]; 
    lines?: Line[]; 
    polygons?: Polygon[]; 
    markers?: Marker[]; 
    diagnostics?: Diagnostic[]; 
    visibility: { [elementId: string]: string };
    circle?: { centerId: string; r: number };
  };
};

// Helper function to create points using geometry core
const createPoint = (x: number, y: number, id: string, label?: string, color?: string, radius = 5): Point => ({
  id, x, y, label, color, radius
});

// Helper function to create lines using geometry core
const createLine = (fromId: string, toId: string, id: string, color?: string, width?: number, dasharray?: string): Line => ({
  id, from: fromId, to: toId, color, width, dasharray
});

// Helper function to create circle line
const createCircle = (centerId: string, id: string, color?: string, width?: number): Line => ({
  id, from: centerId, to: centerId, color, width
});

// Chord Midpoint Theorem - using geometry core for calculations
export const chordMidpointTheorem: Theorem = {
  id: "chord-midpoint",
  title: "Chord Midpoint Theorem",
  statement: "The line drawn from the center of a circle to the midpoint of a chord (other than the diameter) is perpendicular to the chord.",
  steps: [
    { id: "circle", label: "Draw a circle with center O" },
    { id: "chord", label: "Draw chord AB", highlight: ["AB"] },
    { id: "midpoint", label: "Mark M, the midpoint of AB", highlight: ["M"], annotation: [{ id: "M", text: "Midpoint M" }] },
    { id: "radii", label: "Join OA and OB (radii)", highlight: ["OA", "OB"] },
    { id: "connector", label: "Join OM", highlight: ["OM"], annotation: [{ id: "OM", text: "Connector OM" }] },
    { id: "triangles", label: "Consider triangles OAM and OMB", highlight: ["OMA", "OMB"] },
    { id: "equal-sides", label: "Note: AM = MB, OA = OB, OM = OM", highlight: ["OA", "OB", "OM"] },
    { id: "sss", label: "Therefore △OAM ≅ △OMB (SSS)" },
    { id: "angles", label: "So ∠OMA = ∠OMB", highlight: ["rightangle"] },
    { id: "conclude", label: "Hence OM ⟂ AB (proved)", highlight: ["rightangle"] },
  ],
  setup: (width, height) => {
    const CX = width / 2;
    const CY = height / 2 - 10;
    const R = 150;

    // Create points using geometry core
    const O = createPoint(CX, CY, "O", "O", "#fbbf24", 6);
    const A = createPoint(CX - 127, CY + 80, "A", "A", "#ef4444", 5);
    const B = createPoint(CX + 127, CY + 80, "B", "B", "#ef4444", 5);
    
    // Use geometry core for midpoint calculation
    const coreA = point(A.x, A.y, 'A' as any);
    const coreB = point(B.x, B.y, 'B' as any);
    const coreM = midpoint(coreA, coreB);
    const M = createPoint(coreM.x, coreM.y, "M", "M", "#10b981", 5);

    const points = [O, A, B, M];

    const lines: Line[] = [
      createCircle("O", "circle", "#fbbf24", 2.5),
      createLine("A", "B", "AB", "#1f2937", 3),
      createLine("O", "A", "OA", "#94a3b8"),
      createLine("O", "B", "OB", "#94a3b8"),
      createLine("O", "M", "OM", "#f97316", 2.5, "6 4"),
    ];

    const polygons: Polygon[] = [
      { id: "OMA", points: ["O", "M", "A"], color: "#fef3c7", opacity: 0.8 },
      { id: "OMB", points: ["O", "M", "B"], color: "#e0f2fe", opacity: 0.8 },
    ];

    const markers: Marker[] = [
      { id: "rightangle", type: "rightangle", at: "M", size: 14, color: "#064e3b" },
    ];

    // Generate diagnostics using geometry core
    const coreO = point(O.x, O.y, 'O' as any);
    const diagnostics: Diagnostic[] = [
      { label: "|OM|", value: `${distance(coreO, coreM).toFixed(2)} px` },
      { label: "|AM|", value: `${distance(coreA, coreM).toFixed(2)} px` },
      { label: "|BM|", value: `${distance(coreB, coreM).toFixed(2)} px` },
      { label: "∠OMA", value: `${toDeg(angleAt(coreO, coreM, coreA)).toFixed(1)}°` },
      { label: "∠OMB", value: `${toDeg(angleAt(coreO, coreM, coreB)).toFixed(1)}°` },
    ];

    const visibility: Record<string, string> = {
      circle: "circle",
      A: "chord", B: "chord", AB: "chord",
      M: "midpoint",
      O: "circle",
      OA: "radii", OB: "radii",
      OM: "connector",
      OMA: "triangles", OMB: "triangles",
      rightangle: "angles",
    };

    return {
      points, lines, polygons, markers, diagnostics, visibility,
      circle: { centerId: "O", r: R }
    };
  },
};

// Equal Chords Theorem - using geometry core for calculations
export const equalChordsTheorem: Theorem = {
  id: "equal-chords",
  title: "Equal Chords Equidistant from Center",
  statement: "In a circle, equal chords are equidistant from the center.",
  steps: [
    { id: "circle", label: "Draw a circle with center O" },
    { id: "chords", label: "Draw two equal chords AB and CD" },
    { id: "midpoints", label: "Mark E and F as midpoints of AB and CD", highlight: ["E", "F"], annotation: [{ id: "E", text: "midpoint E", dx: -20, dy: -10 }, { id: "F", text: "midpoint F", dx: 12, dy: -10 }] },
    { id: "perpendiculars", label: "Draw OE ⟂ AB and OF ⟂ CD", highlight: ["OE", "OF"], annotation: [{ id: "OE", text: "OE (perpendicular)" }, { id: "OF", text: "OF (perpendicular)" }] },
    { id: "radii", label: "Draw OA and OC (radii)", highlight: ["OA", "OC"], annotation: [{ id: "OA", text: "OA = OC (radii)" }] },
    { id: "triangles", label: "Highlight ΔOAE and ΔOCF", highlight: ["OAE", "OCF"] },
    { id: "congruent", label: "Use congruence to prove ΔOAE ≅ ΔOCF", highlight: ["OAE", "OCF"], annotation: [{ id: "OAE", text: "ΔOAE" }] },
    { id: "result", label: "Conclude OE = OF", highlight: ["OE", "OF"], annotation: [{ id: "OE", text: "OE = OF" }] },
  ],
  setup: (width, height) => {
    const CX = width / 2;
    const CY = height / 2 - 10;
    const R = 160;

    const O = createPoint(CX, CY, "O", "O", "#fbbf24", 6);

    // Bottom chord AB
    const thetaA = (210 * Math.PI) / 180;
    const thetaB = (330 * Math.PI) / 180;
    const A = createPoint(CX + R * Math.cos(thetaA), CY + R * Math.sin(thetaA), "A", "A", "#ef4444", 4);
    const B = createPoint(CX + R * Math.cos(thetaB), CY + R * Math.sin(thetaB), "B", "B", "#ef4444", 4);
    
    // Top chord CD
    const thetaC = (150 * Math.PI) / 180;
    const thetaD = (30 * Math.PI) / 180;
    const C = createPoint(CX + R * Math.cos(thetaC), CY + R * Math.sin(thetaC), "C", "C", "#f43f5e", 4);
    const D = createPoint(CX + R * Math.cos(thetaD), CY + R * Math.sin(thetaD), "D", "D", "#f43f5e", 4);

    // Use geometry core for midpoint calculations
    const coreA = point(A.x, A.y, 'A' as any);
    const coreB = point(B.x, B.y, 'B' as any);
    const coreC = point(C.x, C.y, 'C' as any);
    const coreD = point(D.x, D.y, 'D' as any);
    const coreO = point(O.x, O.y, 'O' as any);
    
    const coreE = midpoint(coreA, coreB);
    const coreF = midpoint(coreC, coreD);
    
    const E = createPoint(coreE.x, coreE.y, "E", "E", "#10b981", 5);
    const F = createPoint(coreF.x, coreF.y, "F", "F", "#10b981", 5);

    const points = [O, A, B, C, D, E, F];

    const lines: Line[] = [
      createCircle("O", "circle", "#fbbf24", 2.5),
      createLine("A", "B", "AB", "#111827", 3),
      createLine("C", "D", "CD", "#111827", 3),
      createLine("O", "A", "OA", "#94a3b8"),
      createLine("O", "C", "OC", "#94a3b8"),
      createLine("O", "E", "OE", "#f97316", 2.5, "6 4"),
      createLine("O", "F", "OF", "#f97316", 2.5, "6 4"),
    ];

    const polygons: Polygon[] = [
      { id: "OAE", points: ["O", "A", "E"], color: "#fef3c7", opacity: 0.9 },
      { id: "OCF", points: ["O", "C", "F"], color: "#e0f2fe", opacity: 0.9 },
    ];

    const markers: Marker[] = [
      { id: "rightangleE", type: "rightangle", at: "E", size: 14, color: "#064e3b" },
      { id: "rightangleF", type: "rightangle", at: "F", size: 14, color: "#064e3b" },
    ];

    // Generate diagnostics using geometry core
    const diagnostics: Diagnostic[] = [
      { label: "|OE|", value: `${distance(coreO, coreE).toFixed(2)} px` },
      { label: "|OF|", value: `${distance(coreO, coreF).toFixed(2)} px` },
      { label: "|AB|", value: `${distance(coreA, coreB).toFixed(2)} px` },
      { label: "|CD|", value: `${distance(coreC, coreD).toFixed(2)} px` },
      { label: "∠AOE", value: `${toDeg(angleAt(coreA, coreO, coreE)).toFixed(1)}°` },
      { label: "∠COF", value: `${toDeg(angleAt(coreC, coreO, coreF)).toFixed(1)}°` },
    ];

    const visibility: Record<string, string> = {
      circle: "circle",
      AB: "chords", CD: "chords", A: "chords", B: "chords", C: "chords", D: "chords",
      E: "midpoints", F: "midpoints",
      OA: "radii", OC: "radii",
      OE: "perpendiculars", OF: "perpendiculars",
      OAE: "triangles", OCF: "triangles",
      rightangleE: "perpendiculars", rightangleF: "perpendiculars",
    };

    return {
      points, lines, polygons, markers, diagnostics, visibility,
      circle: { centerId: "O", r: R }
    };
  },
};

// Export all theorems
export const theorems: Theorem[] = [chordMidpointTheorem, equalChordsTheorem];
