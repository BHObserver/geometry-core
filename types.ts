// src/geometry/types.ts
export type ID = string & { __brand: "ID" };

export interface Point {
  id: ID;
  x: number;
  y: number;
  label?: string;
}

export interface Line {
  id: ID;
  // Normalized ax + by + c = 0 representation makes many tests cheap & robust
  a: number; b: number; c: number;
  through?: [ID, ID]; // optional references to defining points
}

export interface Segment {
  id: ID;
  p1: ID;
  p2: ID;
}

export interface Circle {
  id: ID;
  center: ID;
  r: number; // radius
}

export interface Triangle {
  id: ID;
  a: ID; b: ID; c: ID;
}

export type AngleMeasure = number; // radians by default, keep degrees helpers
export type Length = number;
export type Area = number;
