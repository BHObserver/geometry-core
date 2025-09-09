// src/geometry/ops/diagnostics.ts
import { Point, Line, Triangle } from "../types";
import { distance, angleAt, triangleArea } from "./measures";
import { isPerpendicular, isParallel, isCollinear } from "./relations";
import { toDeg } from "../math/numeric";

export interface GeometryDiagnostics {
  lengths: { [key: string]: number };
  angles: { [key: string]: number };
  areas: { [key: string]: number };
  relations: {
    perpendicular: string[];
    parallel: string[];
    collinear: string[];
  };
}

export const diagnoseTriangle = (
  triangle: Triangle,
  points: Map<string, Point>,
  labels?: { [key: string]: string }
): GeometryDiagnostics => {
  const A = points.get(triangle.a)!;
  const B = points.get(triangle.b)!;
  const C = points.get(triangle.c)!;

  const getLabel = (key: string) => labels?.[key] || key;

  return {
    lengths: {
      [`${getLabel(triangle.a)}${getLabel(triangle.b)}`]: distance(A, B),
      [`${getLabel(triangle.b)}${getLabel(triangle.c)}`]: distance(B, C),
      [`${getLabel(triangle.c)}${getLabel(triangle.a)}`]: distance(C, A),
    },
    angles: {
      [`∠${getLabel(triangle.a)}`]: toDeg(angleAt(B, A, C)),
      [`∠${getLabel(triangle.b)}`]: toDeg(angleAt(C, B, A)),
      [`∠${getLabel(triangle.c)}`]: toDeg(angleAt(A, C, B)),
    },
    areas: {
      [`△${getLabel(triangle.a)}${getLabel(triangle.b)}${getLabel(triangle.c)}`]: Math.abs(triangleArea(A, B, C)),
    },
    relations: {
      perpendicular: [],
      parallel: [],
      collinear: [],
    },
  };
};

export const diagnoseQuadrilateral = (
  points: [Point, Point, Point, Point],
  labels?: [string, string, string, string]
): GeometryDiagnostics => {
  const [A, B, C, D] = points;
  const [labelA, labelB, labelC, labelD] = labels || ['A', 'B', 'C', 'D'];

  const relations = {
    perpendicular: [] as string[],
    parallel: [] as string[],
    collinear: [] as string[],
  };

  // Check all pairs of sides
  const sides = [
    { name: `${labelA}${labelB}`, p1: A, p2: B },
    { name: `${labelB}${labelC}`, p1: B, p2: C },
    { name: `${labelC}${labelD}`, p1: C, p2: D },
    { name: `${labelD}${labelA}`, p1: D, p2: A },
  ];

  for (let i = 0; i < sides.length; i++) {
    for (let j = i + 1; j < sides.length; j++) {
      const side1 = sides[i];
      const side2 = sides[j];
      
      if (isPerpendicular(side1.p1, side1.p2, side2.p1, side2.p2)) {
        relations.perpendicular.push(`${side1.name} ⊥ ${side2.name}`);
      }
      if (isParallel(side1.p1, side1.p2, side2.p1, side2.p2)) {
        relations.parallel.push(`${side1.name} ∥ ${side2.name}`);
      }
    }
  }

  return {
    lengths: {
      [`${labelA}${labelB}`]: distance(A, B),
      [`${labelB}${labelC}`]: distance(B, C),
      [`${labelC}${labelD}`]: distance(C, D),
      [`${labelD}${labelA}`]: distance(D, A),
    },
    angles: {
      [`∠${labelA}`]: toDeg(angleAt(D, A, B)),
      [`∠${labelB}`]: toDeg(angleAt(A, B, C)),
      [`∠${labelC}`]: toDeg(angleAt(B, C, D)),
      [`∠${labelD}`]: toDeg(angleAt(C, D, A)),
    },
    areas: {
      [`□${labelA}${labelB}${labelC}${labelD}`]: Math.abs(triangleArea(A, B, C) + triangleArea(A, C, D)),
    },
    relations,
  };
};

export const formatDiagnostics = (diagnostics: GeometryDiagnostics): string => {
  const lines: string[] = [];
  
  if (Object.keys(diagnostics.lengths).length > 0) {
    lines.push("**Lengths:**");
    Object.entries(diagnostics.lengths).forEach(([key, value]) => {
      lines.push(`  ${key}: ${value.toFixed(3)}`);
    });
  }
  
  if (Object.keys(diagnostics.angles).length > 0) {
    lines.push("**Angles:**");
    Object.entries(diagnostics.angles).forEach(([key, value]) => {
      lines.push(`  ${key}: ${value.toFixed(1)}°`);
    });
  }
  
  if (Object.keys(diagnostics.areas).length > 0) {
    lines.push("**Areas:**");
    Object.entries(diagnostics.areas).forEach(([key, value]) => {
      lines.push(`  ${key}: ${value.toFixed(3)}`);
    });
  }
  
  if (diagnostics.relations.perpendicular.length > 0) {
    lines.push("**Perpendicular:**");
    diagnostics.relations.perpendicular.forEach(rel => {
      lines.push(`  ${rel}`);
    });
  }
  
  if (diagnostics.relations.parallel.length > 0) {
    lines.push("**Parallel:**");
    diagnostics.relations.parallel.forEach(rel => {
      lines.push(`  ${rel}`);
    });
  }
  
  return lines.join('\n');
};