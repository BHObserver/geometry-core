# Interactive Geometry Theorem Visualizer

A data-driven, reusable Geometry Visualizer built with React, TypeScript, and Next.js. The visualizer renders geometry theorems defined in a single file using SVG animations and real-time diagnostics.

## Features

- **🎯 Precise Calculations**: Robust geometric predicates ensure numerical stability
- **📐 Interactive Visualizations**: Step-by-step theorem progression with smooth animations
- **🔍 Real-time Diagnostics**: Live measurements of lengths, angles, and areas
- **🎨 Modern Design**: Dark theme with golden accents for a scientific look
- **📱 Responsive**: Mobile-friendly interface with Tailwind CSS
- **⚡ Performance**: Optimized animations with Framer Motion

## Architecture

The system is designed for maximum reusability:

- **`theorems.ts`**: Contains all theorem definitions and geometry calculations
- **`GeometryVisualizer.tsx`**: Generic component that renders any theorem
- **`page.tsx`**: Demo page with theorem selection

## Adding a New Theorem

To add a new theorem, you only need to edit `components/geometry/theorems.ts`:

### 1. Define the Theorem Structure

```typescript
export const myNewTheorem: Theorem = {
  id: "my-theorem",
  title: "My Theorem Title",
  statement: "The theorem statement goes here",
  steps: [
    { id: "step1", label: "First step", highlight: ["element1"] },
    { id: "step2", label: "Second step", highlight: ["element2"] },
    // ... more steps
  ],
  setup: (width, height) => {
    // Geometry calculations go here
    return {
      points: [...],
      lines: [...],
      polygons: [...],
      markers: [...],
      diagnostics: [...],
      visibility: {...},
      circle: { centerId: "O", r: 150 }
    };
  }
};
```

### 2. Add to Exports

```typescript
export const theorems: Theorem[] = [
  chordMidpointTheorem, 
  equalChordsTheorem,
  myNewTheorem  // Add your new theorem here
];
```

### 3. Use Geometry Core for Calculations

The system leverages the geometry core for precise calculations:

```typescript
// Create points
const A = createPoint(x, y, "A", "A", "#ef4444", 5);

// Calculate midpoints using geometry core
const coreA = point(A.x, A.y, 'A');
const coreB = point(B.x, B.y, 'B');
const coreM = midpoint(coreA, coreB);
const M = createPoint(coreM.x, coreM.y, "M", "M", "#10b981", 5);

// Generate diagnostics
const diagnostics: Diagnostic[] = [
  { label: "|OM|", value: `${distance(coreO, coreM).toFixed(2)} px` },
  { label: "∠OMA", value: `${toDeg(angleAt(coreO, coreM, coreA)).toFixed(1)}°` },
];
```

### 4. Define Visibility Mapping

Each element needs a visibility mapping that determines when it appears:

```typescript
const visibility: Record<string, string> = {
  circle: "circle",        // Appears in "circle" step
  A: "chord",             // Appears in "chord" step
  M: "midpoint",          // Appears in "midpoint" step
  rightangle: "angles",   // Appears in "angles" step
};
```

## Key Benefits

### 🚀 **Simplified Theorem Creation**
- No need to modify the visualizer component
- Geometry core handles all complex calculations
- Automatic diagnostic generation
- Consistent animation and interaction patterns

### 🎯 **Robust Geometry**
- Uses your existing geometry core for precision
- Robust predicates prevent floating-point errors
- Complete congruence testing capabilities
- Real-time diagnostic calculations

### 🎨 **Modern UI/UX**
- Dark theme with golden accents
- Smooth animations and transitions
- Interactive element highlighting
- Mobile-responsive design

## File Structure

```
components/geometry/
├── theorems.ts              # All theorem definitions
├── GeometryVisualizer.tsx    # Generic visualizer component
└── utils/
    └── geometry.ts          # Geometry utility functions

app/geometry/
└── page.tsx                 # Demo page with theorem selection
```

## Usage

1. **Select a Theorem**: Use the dropdown to choose between available theorems
2. **Navigate Steps**: Use Prev/Next buttons to progress through the proof
3. **View Diagnostics**: Toggle diagnostics to see real-time measurements
4. **Interact**: Click on elements for detailed information
5. **Control**: Use Reset and Replay buttons for navigation control

## Technical Details

- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS with custom dark theme
- **Animations**: Framer Motion for smooth transitions
- **Geometry**: Custom geometry core with robust predicates
- **TypeScript**: Full type safety throughout
- **Responsive**: Mobile-first design approach

The system is designed to be both powerful and maintainable, allowing you to focus on the mathematical content while the framework handles the visualization and interaction details.