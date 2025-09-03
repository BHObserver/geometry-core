// src/geometry/ops/congruence.ts
import { Point, Triangle } from "../types";
import { distance, angleAt } from "./measures";
import { approxEq, toDeg } from "../math/numeric";

// Helper: side lengths and angles (in degrees) in a stable order
export const triangleSignature = (A: Point, B: Point, C: Point) => {
  const sides = [distance(B, C), distance(C, A), distance(A, B)].sort((x, y) => x - y);
  const angles = [
    toDeg(angleAt(B, A, C)),
    toDeg(angleAt(C, B, A)),
    toDeg(angleAt(A, C, B)),
  ].sort((x, y) => x - y);
  return { sides, angles };
};

export type CongruenceType = "SSS" | "SAS" | "ASA" | "AAS" | "HL";

export const congruenceTest = (
  tri1: [Point, Point, Point],
  tri2: [Point, Point, Point],
  mode: CongruenceType,
  eps = 1e-6
): boolean => {
  const sig1 = triangleSignature(...tri1);
  const sig2 = triangleSignature(...tri2);

  const eqArr = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= eps);

  switch (mode) {
    case "SSS":
      return eqArr(sig1.sides, sig2.sides);
    case "SAS": {
      // Match two smallest sides + included angle heuristic
      const s1 = sig1.sides.slice(0, 2), s2 = sig2.sides.slice(0, 2);
      const a1 = sig1.angles[1]; // middle angle roughly “included”
      const a2 = sig2.angles[1];
      return eqArr(s1, s2) && Math.abs(a1 - a2) <= 1e-4;
    }
    case "ASA": {
      const a1 = [sig1.angles[0], sig1.angles[2]]; // two extremes
      const a2 = [sig2.angles[0], sig2.angles[2]];
      const s1 = [sig1.sides[1]]; // side between extremes
      const s2 = [sig2.sides[1]];
      return eqArr(a1, a2) && eqArr(s1, s2);
    }
    case "AAS": {
      const a1 = [sig1.angles[0], sig1.angles[1]];
      const a2 = [sig2.angles[0], sig2.angles[1]];
      const s1 = [sig1.sides[2]]; // side adjacent to one of the angles roughly
      const s2 = [sig2.sides[2]];
      return eqArr(a1, a2) && eqArr(s1, s2);
    }
    case "HL": {
      // Right triangles: compare hypotenuse + a leg
      const [h1, l1a, l1b] = [sig1.sides[2], sig1.sides[1], sig1.sides[0]];
      const [h2, l2a, l2b] = [sig2.sides[2], sig2.sides[1], sig2.sides[0]];
      return Math.abs(h1 - h2) <= eps && (Math.abs(l1a - l2a) <= eps || Math.abs(l1a - l2b) <= eps);
    }
  }
};
