// src/theorems/examples.ts
import { Theorem } from './types';
import { point, lineThrough } from '../primitives';
import { midpoint, perpendicularBisector } from '../ops/constructions';
import { congruenceTest } from '../ops/congruence';

// Example: SSS Congruence Theorem
export const sssCongruenceTheorem: Theorem = {
  id: 'sss-congruence' as any,
  title: 'SSS Congruence Theorem',
  description: 'If three sides of one triangle are congruent to three sides of another triangle, then the triangles are congruent.',
  category: 'congruence',
  difficulty: 'beginner',
  initialElements: {
    points: ['A', 'B', 'C', 'D', 'E', 'F'] as any[],
    lines: ['AB', 'BC', 'CA', 'DE', 'EF', 'FD'] as any[],
    circles: [] as any[],
    triangles: ['ABC', 'DEF'] as any[],
  },
  steps: [
    {
      id: 'step-1' as any,
      stepNumber: 1,
      title: 'Given Triangles',
      description: 'We have two triangles: △ABC and △DEF',
      highlightedElements: ['A', 'B', 'C', 'D', 'E', 'F', 'AB', 'BC', 'CA', 'DE', 'EF', 'FD'] as any[],
      proof: {
        given: ['△ABC', '△DEF', 'AB ≅ DE', 'BC ≅ EF', 'CA ≅ FD'],
        toProve: '△ABC ≅ △DEF',
        reasoning: ['We are given that all three sides of △ABC are congruent to the corresponding sides of △DEF']
      }
    },
    {
      id: 'step-2' as any,
      stepNumber: 2,
      title: 'Measure Side Lengths',
      description: 'Verify that AB = DE, BC = EF, and CA = FD',
      highlightedElements: ['AB', 'DE', 'BC', 'EF', 'CA', 'FD'] as any[],
      proof: {
        given: ['AB ≅ DE', 'BC ≅ EF', 'CA ≅ FD'],
        toProve: 'All corresponding sides are equal in length',
        reasoning: ['By definition of congruence, congruent segments have equal lengths']
      }
    },
    {
      id: 'step-3' as any,
      stepNumber: 3,
      title: 'Apply SSS Criterion',
      description: 'Since all three sides are congruent, the triangles are congruent by SSS',
      highlightedElements: ['ABC', 'DEF'] as any[],
      proof: {
        given: ['AB ≅ DE', 'BC ≅ EF', 'CA ≅ FD'],
        toProve: '△ABC ≅ △DEF',
        reasoning: [
          'By the SSS (Side-Side-Side) congruence criterion',
          'If three sides of one triangle are congruent to three sides of another triangle',
          'Then the triangles are congruent'
        ]
      }
    }
  ]
};

// Example: Perpendicular Bisector Construction
export const perpendicularBisectorTheorem: Theorem = {
  id: 'perpendicular-bisector' as any,
  title: 'Perpendicular Bisector Construction',
  description: 'Construct the perpendicular bisector of a line segment using only a compass and straightedge.',
  category: 'constructions',
  difficulty: 'beginner',
  initialElements: {
    points: ['A', 'B'] as any[],
    lines: ['AB'] as any[],
    circles: [] as any[],
    triangles: [] as any[],
  },
  steps: [
    {
      id: 'step-1' as any,
      stepNumber: 1,
      title: 'Given Line Segment',
      description: 'We have line segment AB',
      highlightedElements: ['A', 'B', 'AB'] as any[],
      proof: {
        given: ['Line segment AB'],
        toProve: 'Construct perpendicular bisector of AB',
        reasoning: ['We need to find the line that is perpendicular to AB and passes through its midpoint']
      }
    },
    {
      id: 'step-2' as any,
      stepNumber: 2,
      title: 'Find Midpoint',
      description: 'Construct the midpoint M of segment AB',
      highlightedElements: ['A', 'B', 'AB'] as any[],
      construction: {
        type: 'midpoint',
        parameters: { segment: 'AB' }
      },
      proof: {
        given: ['Line segment AB'],
        toProve: 'Find midpoint M of AB',
        reasoning: ['The midpoint divides the segment into two equal parts']
      }
    },
    {
      id: 'step-3' as any,
      stepNumber: 3,
      title: 'Construct Perpendicular',
      description: 'Construct the line perpendicular to AB through point M',
      highlightedElements: ['A', 'B', 'AB', 'M'] as any[],
      construction: {
        type: 'perpendicular',
        parameters: { line: 'AB', point: 'M' }
      },
      proof: {
        given: ['Line segment AB', 'Midpoint M of AB'],
        toProve: 'Construct perpendicular bisector',
        reasoning: [
          'The perpendicular bisector is perpendicular to AB',
          'And passes through the midpoint M',
          'This line divides AB into two equal parts at right angles'
        ]
      }
    }
  ]
};

export const exampleTheorems = [
  sssCongruenceTheorem,
  perpendicularBisectorTheorem,
];
