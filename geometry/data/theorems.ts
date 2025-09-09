// components/geometry/data/theorems.ts
export type Point = { id: string; x: number; y: number; label?: string; color?: string; radius?: number };
export type Line = { id: string; from: string; to: string; color?: string; width?: number; dasharray?: string; type?: "line" | "circle" };
export type Polygon = { id: string; points: string[]; color?: string; opacity?: number };
export type Marker = { id: string; type: "rightangle"; at: string; size?: number; color?: string };
export type Diagnostic = { label: string; value: string };

export type Step = {
  id: string;
  label: string;
  // elements to ensure visible on this step (in addition to base visibility mapping)
  show?: string[];
  // elements to visually highlight on this step (outline, pulse)
  highlight?: string[];
  // short annotation for UI next to highlight
  annotation?: { id: string; text: string; dx?: number; dy?: number }[];
};

export type CircleMeta = { centerId: string; r: number };

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
    visibility: { [id: string]: string };
    circle?: CircleMeta;
  };
};

/* Example: Chord Midpoint Theorem (unchanged semantics but with circle meta) */
export const chordMidpointTheorem: Theorem = {
  id: "chord-midpoint",
  title: "Chord Midpoint Theorem",
  statement:
    "The line drawn from the center of a circle to the midpoint of a chord (other than the diameter) is perpendicular to the chord.",
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
  setup: (WIDTH, HEIGHT) => {
    const CX = WIDTH / 2;
    const CY = HEIGHT / 2 - 10;
    const R = 150;

    // chord points symmetric about vertical axis
    const A = { id: "A", x: CX - 127, y: CY + 80, label: "A", color: "#ef4444", radius: 5 };
    const B = { id: "B", x: CX + 127, y: CY + 80, label: "B", color: "#ef4444", radius: 5 };
    const O = { id: "O", x: CX, y: CY, label: "O", color: "#6366f1", radius: 6 };
    const M = { id: "M", x: (A.x + B.x) / 2, y: (A.y + B.y) / 2, label: "M", color: "#10b981", radius: 5 };

    const points = [O, A, B, M];

    const lines: Line[] = [
      { id: "circle", from: "O", to: "O", type: "circle" },
      { id: "AB", from: "A", to: "B", color: "#1f2937", width: 3 }, // chord, dark
      { id: "OA", from: "O", to: "A", color: "#94a3b8" },           // radii
      { id: "OB", from: "O", to: "B", color: "#94a3b8" },
      { id: "OM", from: "O", to: "M", color: "#f97316", width: 2.5, dasharray: "6 4" }, // connector, dashed
    ];

    const polygons: Polygon[] = [
      { id: "OMA", points: ["O", "M", "A"], color: "#fef3c7", opacity: 0.8 },
      { id: "OMB", points: ["O", "M", "B"], color: "#e0f2fe", opacity: 0.8 },
    ];

    const markers: Marker[] = [
      { id: "rightangle", type: "rightangle", at: "M", size: 14, color: "#064e3b" },
    ];

    const visibility: Record<string, string> = {
      circle: "circle",
      A: "chord",
      B: "chord",
      AB: "chord",
      M: "midpoint",
      O: "circle",
      OA: "radii",
      OB: "radii",
      OM: "connector",
      OMA: "triangles",
      OMB: "triangles",
      rightangle: "angles",
    };

    return {
      points,
      lines,
      polygons,
      markers,
      visibility,
      diagnostics: [],
      circle: { centerId: "O", r: R },
    };
  },
};



/* Equal Chords Equidistant from Center - with annotations and better step fields */
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
  setup: (WIDTH, HEIGHT) => {
    const CX = WIDTH / 2;
    const CY = HEIGHT / 2 - 10;
    const R = 160;

    const O = { id: "O", x: CX, y: CY, label: "O", color: "#6366f1", radius: 6 };

    // Bottom chord AB
    const thetaA = (210 * Math.PI) / 180;
    const thetaB = (330 * Math.PI) / 180;
    const A = { id: "A", x: CX + R * Math.cos(thetaA), y: CY + R * Math.sin(thetaA), label: "A", color: "#ef4444", radius: 4 };
    const B = { id: "B", x: CX + R * Math.cos(thetaB), y: CY + R * Math.sin(thetaB), label: "B", color: "#ef4444", radius: 4 };
    const E = { id: "E", x: (A.x + B.x) / 2, y: (A.y + B.y) / 2, label: "E", color: "#10b981", radius: 5 };

    // Top chord CD
    const thetaC = (150 * Math.PI) / 180;
    const thetaD = (30 * Math.PI) / 180;
    const C = { id: "C", x: CX + R * Math.cos(thetaC), y: CY + R * Math.sin(thetaC), label: "C", color: "#f43f5e", radius: 4 };
    const D = { id: "D", x: CX + R * Math.cos(thetaD), y: CY + R * Math.sin(thetaD), label: "D", color: "#f43f5e", radius: 4 };
    const F = { id: "F", x: (C.x + D.x) / 2, y: (C.y + D.y) / 2, label: "F", color: "#10b981", radius: 5 };

    const points = [O, A, B, C, D, E, F];

    const lines: Line[] = [
      { id: "circle", from: "O", to: "O", type: "circle" }, // indicate circle type
      { id: "AB", from: "A", to: "B", color: "#111827", width: 3 },
      { id: "CD", from: "C", to: "D", color: "#111827", width: 3 },
      { id: "OA", from: "O", to: "A", color: "#94a3b8" },
      { id: "OC", from: "O", to: "C", color: "#94a3b8" },
      { id: "OE", from: "O", to: "E", color: "#f97316", width: 2.5, dasharray: "6 4" },
      { id: "OF", from: "O", to: "F", color: "#f97316", width: 2.5, dasharray: "6 4" },
    ];

    const polygons: Polygon[] = [
      { id: "OAE", points: ["O", "A", "E"], color: "#fef3c7", opacity: 0.9 },
      { id: "OCF", points: ["O", "C", "F"], color: "#e0f2fe", opacity: 0.9 },
    ];

    const markers: Marker[] = [
      { id: "rightangleE", type: "rightangle", at: "E", size: 14, color: "#064e3b" },
      { id: "rightangleF", type: "rightangle", at: "F", size: 14, color: "#064e3b" },
    ];

    const diagnostics: Diagnostic[] = [];

    const visibility: { [id: string]: string } = {
      circle: "circle",
      AB: "chords",
      CD: "chords",
      A: "chords",
      B: "chords",
      C: "chords",
      D: "chords",
      E: "midpoints",
      F: "midpoints",
      OA: "radii",
      OC: "radii",
      OE: "perpendiculars",
      OF: "perpendiculars",
      OAE: "triangles",
      OCF: "triangles",
      rightangleE: "perpendiculars",
      rightangleF: "perpendiculars",
    };

    return { points, lines, polygons, markers, diagnostics, visibility, circle: { centerId: "O", r: R } };
  },
};

export const theorems: Theorem[] = [chordMidpointTheorem, equalChordsTheorem];
