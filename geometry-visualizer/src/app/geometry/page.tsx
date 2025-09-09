// app/geometry/page.tsx
"use client";

import React, { useState } from "react";
import GeometryVisualizer from "../../components/geometry/GeometryVisualizer";
import { theorems } from "../../components/geometry/theorems";

export default function GeometryPage() {
  const [selectedTheoremId, setSelectedTheoremId] = useState("chord-midpoint");

  const handleTheoremChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheoremId(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Interactive Geometry Theorem Visualizer
          </h1>
          <p className="text-gray-400 text-lg">
            Explore geometric proofs with step-by-step visualizations
          </p>
        </div>

        {/* Theorem Selection */}
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label 
              htmlFor="theorem-select" 
              className="text-white font-semibold whitespace-nowrap"
            >
              Select Theorem:
            </label>
            <select
              id="theorem-select"
              value={selectedTheoremId}
              onChange={handleTheoremChange}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {theorems.map((theorem) => (
                <option key={theorem.id} value={theorem.id}>
                  {theorem.title}
                </option>
              ))}
            </select>
          </div>
          
          {/* Selected Theorem Info */}
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">
              {theorems.find(t => t.id === selectedTheoremId)?.title}
            </h3>
            <p className="text-gray-300">
              {theorems.find(t => t.id === selectedTheoremId)?.statement}
            </p>
          </div>
        </div>

        {/* Visualizer */}
        <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
          <GeometryVisualizer 
            theoremId={selectedTheoremId} 
            width={800} 
            height={500}
          />
        </div>

        {/* Features Overview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3">🎯 Precise Calculations</h3>
            <p className="text-gray-400">
              Robust geometric predicates ensure numerical stability and accuracy in all calculations.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3">📐 Interactive Visualizations</h3>
            <p className="text-gray-400">
              Step-by-step theorem progression with smooth animations and element highlighting.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3">🔍 Real-time Diagnostics</h3>
            <p className="text-gray-400">
              Live measurements of lengths, angles, and areas with comprehensive geometric analysis.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-2">Navigation</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• Use <strong className="text-white">Prev/Next</strong> to navigate through steps</li>
                <li>• Click <strong className="text-white">Reset</strong> to return to the beginning</li>
                <li>• Use <strong className="text-white">Replay</strong> to restart animations</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-2">Interaction</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• Click on any element to see detailed information</li>
                <li>• Toggle <strong className="text-white">Diagnostics</strong> to see measurements</li>
                <li>• Watch elements highlight as you progress through steps</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
