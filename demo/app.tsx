// demo/app.tsx - Demonstration of the geometry system power
import React, { useState } from 'react';
import GeometryVisualizer from '../geometry/GeomteryVisualizer';
import { theorems } from '../geometry/data/theorems';
import { chordMidpointTheorem, equalChordsTheorem } from '../geometry/data/theorems';

// Import our enhanced geometry utilities
import { 
  point, 
  lineThrough, 
  midpoint, 
  perpendicularBisector,
  congruenceTest,
  diagnoseTriangle,
  formatDiagnostics
} from '../geometryUtils';

export default function GeometryDemo() {
  const [selectedTheorem, setSelectedTheorem] = useState('chord-midpoint');
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);

  // Demonstrate our enhanced geometry capabilities
  const demonstrateGeometryPower = () => {
    console.log("=== GEOMETRY SYSTEM DEMONSTRATION ===");
    
    // 1. Create precise geometry elements
    const A = point(0, 0, 'A');
    const B = point(100, 0, 'B');
    const C = point(50, 100, 'C');
    
    console.log("Created triangle ABC:", { A, B, C });
    
    // 2. Perform constructions
    const mid = midpoint(A, B);
    const { bisector } = perpendicularBisector(A, B);
    
    console.log("Midpoint of AB:", mid);
    console.log("Perpendicular bisector:", bisector);
    
    // 3. Test congruence
    const D = point(200, 0, 'D');
    const E = point(300, 0, 'E');
    const F = point(250, 100, 'F');
    
    const isCongruent = congruenceTest([A, B, C], [D, E, F], 'SSS');
    console.log("Triangles ABC and DEF are congruent (SSS):", isCongruent);
    
    // 4. Generate diagnostics
    const diagnostics = diagnoseTriangle(
      { id: 'ABC' as any, a: A.id, b: B.id, c: C.id },
      new Map([
        [A.id, A],
        [B.id, B], 
        [C.id, C]
      ]),
      { [A.id]: 'A', [B.id]: 'B', [C.id]: 'C' }
    );
    
    console.log("Triangle diagnostics:");
    console.log(formatDiagnostics(diagnostics));
    
    return { A, B, C, mid, bisector, isCongruent, diagnostics };
  };

  const runGeometryDemo = () => {
    const results = demonstrateGeometryPower();
    setShowAdvancedFeatures(true);
    return results;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Interactive Geometry Proof System
        </h1>
        
        {/* System Capabilities Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">System Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Precise Calculations</h3>
              <p className="text-sm text-blue-700">Robust predicates for numerical stability</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Congruence Tests</h3>
              <p className="text-sm text-green-700">SSS, SAS, ASA, AAS, HL criteria</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Constructions</h3>
              <p className="text-sm text-purple-700">Midpoint, perpendicular bisector</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900">Real-time Diagnostics</h3>
              <p className="text-sm text-orange-700">Length, angle, area measurements</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-900">Interactive Visualization</h3>
              <p className="text-sm text-red-700">Step-by-step theorem progression</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900">Educational Focus</h3>
              <p className="text-sm text-yellow-700">Pedagogical consistency maintained</p>
            </div>
          </div>
        </div>

        {/* Theorem Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Available Theorems</h2>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setSelectedTheorem('chord-midpoint')}
              className={`px-4 py-2 rounded-lg ${
                selectedTheorem === 'chord-midpoint' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Chord Midpoint Theorem
            </button>
            <button
              onClick={() => setSelectedTheorem('equal-chords')}
              className={`px-4 py-2 rounded-lg ${
                selectedTheorem === 'equal-chords' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Equal Chords Theorem
            </button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              {theorems.find(t => t.id === selectedTheorem)?.title}
            </h3>
            <p className="text-gray-700">
              {theorems.find(t => t.id === selectedTheorem)?.statement}
            </p>
          </div>
        </div>

        {/* Advanced Features Demo */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Advanced Geometry Features</h2>
          <button
            onClick={runGeometryDemo}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Run Geometry System Demo
          </button>
          
          {showAdvancedFeatures && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Demo Results (Check Console)</h3>
              <p className="text-sm text-gray-600">
                The geometry system has been demonstrated with:
              </p>
              <ul className="list-disc ml-6 mt-2 text-sm text-gray-600">
                <li>Precise point creation and triangle construction</li>
                <li>Midpoint and perpendicular bisector calculations</li>
                <li>SSS congruence testing</li>
                <li>Comprehensive triangle diagnostics</li>
                <li>Real-time measurements and relationships</li>
              </ul>
            </div>
          )}
        </div>

        {/* Interactive Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Interactive Theorem Visualization</h2>
          <GeometryVisualizer 
            theoremId={selectedTheorem} 
            width={800} 
            height={500}
          />
        </div>

        {/* Integration Notes */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Integration Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Your Existing System</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Interactive SVG-based visualizer</li>
                <li>• Framer Motion animations</li>
                <li>• Step-by-step theorem progression</li>
                <li>• Real-time diagnostics</li>
                <li>• Two complete theorems</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Enhanced Geometry Core</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Robust geometric predicates</li>
                <li>• Complete congruence tests</li>
                <li>• Construction tools</li>
                <li>• Comprehensive diagnostics</li>
                <li>• TypeScript type safety</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Perfect Integration</h4>
            <p className="text-sm text-blue-700">
              Your existing visualization system seamlessly integrates with our enhanced geometry core. 
              The robust calculations power the interactive diagnostics, while your beautiful UI provides 
              the educational experience. This combination gives you full pedagogical control with 
              mathematical precision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
