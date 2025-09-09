// src/geometry/math/numeric.ts
export const EPS = 1e-9;                    // general numeric tolerance
export const RIGHT_EPS = 1e-10;             // tighter for right-angle tests
export const approxEq = (x: number, y: number, eps = EPS) => Math.abs(x - y) <= eps;

export const toRad = (deg: number) => (deg * Math.PI) / 180;
export const toDeg = (rad: number) => (rad * 180) / Math.PI;
export const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));
export const modTau = (t: number) => {
  const TWO_PI = Math.PI * 2;
  const m = t % TWO_PI;
  return m < 0 ? m + TWO_PI : m;
};
