// src/geometry/math/robust.ts
import robust from "robust-predicates"; // orient2d, incircle
import crosses from "robust-segment-intersect";

import { Point } from "../types";

export const orient = (a: Point, b: Point, c: Point): number =>
  robust.orient2d([a.x, a.y], [b.x, b.y], [c.x, c.y]); // >0 left, <0 right, 0 collinear

export const isCollinear = (a: Point, b: Point, c: Point) => orient(a, b, c) === 0;

export const incircle = (a: Point, b: Point, c: Point, d: Point): number =>
  robust.incircle([a.x, a.y], [b.x, b.y], [c.x, c.y], [d.x, d.y]); // >0 inside

export const segmentsIntersect = (a1: Point, a2: Point, b1: Point, b2: Point) =>
  crosses([a1.x, a1.y], [a2.x, a2.y], [b1.x, b1.y], [b2.x, b2.y]); // boolean
