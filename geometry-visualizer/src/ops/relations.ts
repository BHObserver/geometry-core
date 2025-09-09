// src/geometry/ops/relations.ts
import { Point, Line } from "../types";
import { orient } from "../math/robust";
import { RIGHT_EPS, approxEq } from "../math/numeric";

// Dot and cross on raw coords
const dot = (ux: number, uy: number, vx: number, vy: number) => ux * vx + uy * vy;
const cross = (ux: number, uy: number, vx: number, vy: number) => ux * vy - uy * vx;

export const isPerpendicular = (a: Point, b: Point, c: Point, d: Point) => {
  const ux = b.x - a.x, uy = b.y - a.y;
  const vx = d.x - c.x, vy = d.y - c.y;
  return Math.abs(dot(ux, uy, vx, vy)) <= RIGHT_EPS * Math.hypot(ux, uy) * Math.hypot(vx, vy);
};

export const isParallel = (a: Point, b: Point, c: Point, d: Point) => {
  const ux = b.x - a.x, uy = b.y - a.y;
  const vx = d.x - c.x, vy = d.y - c.y;
  return Math.abs(cross(ux, uy, vx, vy)) <= RIGHT_EPS * Math.hypot(ux, uy) * Math.hypot(vx, vy);
};

export const isCollinear = (a: Point, b: Point, c: Point) => orient(a, b, c) === 0;

export const pointOnLine = (p: Point, l: Line) =>
  Math.abs(l.a * p.x + l.b * p.y + l.c) <= RIGHT_EPS;

export const pointOnSegment = (p: Point, a: Point, b: Point) =>
  isCollinear(a, b, p) &&
  (p.x - Math.min(a.x, b.x)) >= -RIGHT_EPS && (Math.max(a.x, b.x) - p.x) >= -RIGHT_EPS &&
  (p.y - Math.min(a.y, b.y)) >= -RIGHT_EPS && (Math.max(a.y, b.y) - p.y) >= -RIGHT_EPS;
