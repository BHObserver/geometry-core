// components/geometry/utils/geometry.ts
export type P = { x: number; y: number };

export const add = (a: P, b: P): P => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: P, b: P): P => ({ x: a.x - b.x, y: a.y - b.y });
export const mul = (a: P, k: number): P => ({ x: a.x * k, y: a.y * k });
export const dot = (a: P, b: P): number => a.x * b.x + a.y * b.y;
export const len = (a: P): number => Math.hypot(a.x, a.y);
export const dist = (a: P, b: P): number => len(sub(a, b));
export const midpoint = (a: P, b: P): P => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

/** Projection foot of P onto line AB (infinite line). */
export function footOfPerp(P: P, A: P, B: P): P {
  const AB = sub(B, A);
  const AP = sub(P, A);
  const ab2 = dot(AB, AB);
  if (ab2 === 0) return A;
  const t = dot(AP, AB) / ab2;
  return add(A, mul(AB, t));
}

/** Angle at vertex B formed by BA -> BC (in radians). */
export function angleBetween(A: P, B: P, C: P): number {
  const v1 = sub(A, B);
  const v2 = sub(C, B);
  const d = dot(v1, v2);
  const denom = len(v1) * len(v2);
  if (denom === 0) return 0;
  const cos = Math.min(1, Math.max(-1, d / denom));
  return Math.acos(cos);
}

/** Create a small right-angle marker polygon given vertex at V and two adjacent points P and Q that form the right angle at V. */
export function rightAngleSquare(V: P, P1: P, P2: P, size = 12): P[] {
  // direction vectors from vertex
  const v1 = sub(P1, V);
  const v2 = sub(P2, V);
  // normalize
  const l1 = len(v1) || 1;
  const l2 = len(v2) || 1;
  const u1 = { x: v1.x / l1, y: v1.y / l1 };
  const u2 = { x: v2.x / l2, y: v2.y / l2 };

  // pick scaled directions inward
  const pA = add(V, mul(u1, size * 0.45));
  const pB = add(pA, mul(u2, size * 0.45));
  const pC = add(V, mul(u2, size * 0.45));
  return [V, pA, pB, pC];
}
