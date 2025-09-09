// src/theorems/types.ts
import { ID } from '../types';

export interface TheoremStep {
  id: ID;
  stepNumber: number;
  title: string;
  description: string;
  highlightedElements: ID[];
  construction?: {
    type: 'midpoint' | 'perpendicular' | 'angle_bisector' | 'circle' | 'parallel';
    parameters: any;
  };
  proof?: {
    given: string[];
    toProve: string;
    reasoning: string[];
  };
}

export interface Theorem {
  id: ID;
  title: string;
  description: string;
  category: 'congruence' | 'parallel_lines' | 'circles' | 'triangles' | 'quadrilaterals';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: TheoremStep[];
  initialElements: {
    points: ID[];
    lines: ID[];
    circles: ID[];
    triangles: ID[];
  };
}

export interface TheoremVisualization {
  theorem: Theorem;
  currentStep: number;
  elements: Map<ID, any>; // Geometry elements
  diagnostics?: any;
  isComplete: boolean;
}

export interface TheoremProgress {
  theoremId: ID;
  completedSteps: ID[];
  currentStep: ID;
  timeSpent: number;
  attempts: number;
}
