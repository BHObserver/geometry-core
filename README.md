# Geometry Core - Interactive Proof Visualization System

A robust TypeScript-based geometry system for interactive theorem visualization and proof construction, designed for educational applications.

## Features

### Core Geometry Operations
- **Precise Calculations**: Using robust predicates for numerical stability
- **Complete Congruence Tests**: SSS, SAS, ASA, AAS, HL criteria
- **Construction Tools**: Midpoint, perpendicular bisector, angle bisector
- **Diagnostics**: Length, angle, and area measurements with automatic relation detection

### Visualization System
- **React Konva Integration**: High-performance canvas rendering
- **Interactive Elements**: Drag-and-drop geometry elements
- **Step-by-Step Highlighting**: Pedagogical theorem progression
- **Real-time Diagnostics**: Live measurements and relationship detection

## Architecture

```
src/
├── primitives/          # Core geometry primitives
│   ├── Point.ts
│   ├── Line.ts
│   ├── Circle.ts
│   └── Triangle.ts
├── ops/                 # Geometric operations
│   ├── measures.ts      # Distance, angle, area calculations
│   ├── relations.ts     # Perpendicular, parallel, collinear tests
│   ├── constructions.ts # Midpoint, perpendicular bisector
│   ├── congruence.ts    # SSS, SAS, ASA, AAS, HL tests
│   └── diagnostics.ts   # Comprehensive geometry analysis
├── math/                # Mathematical utilities
│   ├── numeric.ts       # Precision constants and helpers
│   └── robust.ts        # Robust geometric predicates
├── components/          # React visualization components
│   └── GeometryCanvas.tsx
└── theorems/            # Theorem definitions and visualization
    ├── types.ts
    ├── examples.ts
    └── visualization.ts
```

## Quick Start

### Installation

```bash
npm install
```

### Basic Usage

```typescript
import { point, lineThrough } from './primitives';
import { midpoint, perpendicularBisector } from './ops/constructions';
import { congruenceTest } from './ops/congruence';
import { GeometryCanvas } from './components/GeometryCanvas';

// Create geometry elements
const A = point(0, 0, 'A');
const B = point(100, 0, 'B');
const C = point(50, 100, 'C');

// Perform constructions
const mid = midpoint(A, B);
const { bisector } = perpendicularBisector(A, B);

// Test congruence
const isCongruent = congruenceTest([A, B, C], [D, E, F], 'SSS');

// Render with React Konva
<GeometryCanvas
  width={800}
  height={600}
  elements={geometryElements}
  showDiagnostics={true}
/>
```

## Key Components

### Geometry Primitives
- **Point**: 2D coordinates with optional labels
- **Line**: Normalized ax + by + c = 0 representation
- **Circle**: Center point and radius
- **Triangle**: Three vertex references

### Operations
- **Measures**: Distance, angles, areas with high precision
- **Relations**: Perpendicular, parallel, collinear detection
- **Constructions**: Compass and straightedge constructions
- **Congruence**: All five congruence criteria
- **Diagnostics**: Comprehensive geometry analysis

### Visualization
- **Interactive Canvas**: Drag-and-drop geometry elements
- **Step-by-Step Progression**: Theorem visualization with highlighting
- **Real-time Diagnostics**: Live measurements and relationships
- **Educational Focus**: Pedagogical consistency maintained

## Precision and Robustness

The system uses robust geometric predicates to ensure numerical stability:
- `robust-predicates`: For orientation and incircle tests
- `robust-segment-intersect`: For reliable intersection detection
- Custom epsilon-based comparisons for floating-point equality

## Educational Integration

### Theorem Structure
```typescript
interface Theorem {
  title: string;
  steps: TheoremStep[];
  initialElements: GeometryElements;
}

interface TheoremStep {
  title: string;
  description: string;
  highlightedElements: string[];
  construction?: ConstructionStep;
  proof?: ProofStep;
}
```

### Visualization Control
- Full control over proof logic and visual presentation
- Step-by-step highlighting of diagram elements
- Interactive construction tools
- Real-time diagnostic feedback

## Performance

- **Pure TypeScript**: No WebAssembly dependencies
- **Optimized Algorithms**: Efficient geometric computations
- **Canvas Rendering**: High-performance 2D graphics
- **Minimal Bundle**: Lightweight core with optional features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement with tests
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
