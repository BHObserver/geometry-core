// src/components/GeometryCanvas.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Line, Circle, Text, Group } from 'react-konva';
import { Point, Line as GeometryLine, Circle as GeometryCircle, Triangle } from '../types';
import { distance, angleAt } from '../ops/measures';
import { toDeg } from '../math/numeric';

export interface GeometryElement {
  id: string;
  type: 'point' | 'line' | 'circle' | 'triangle';
  data: Point | GeometryLine | GeometryCircle | Triangle;
  style?: {
    stroke?: string;
    fill?: string;
    strokeWidth?: number;
    opacity?: number;
  };
  highlight?: boolean;
  label?: string;
}

export interface GeometryCanvasProps {
  width: number;
  height: number;
  elements: GeometryElement[];
  onElementClick?: (element: GeometryElement) => void;
  onElementDrag?: (element: GeometryElement, newPosition: Point) => void;
  showDiagnostics?: boolean;
  diagnostics?: any;
}

export const GeometryCanvas: React.FC<GeometryCanvasProps> = ({
  width,
  height,
  elements,
  onElementClick,
  onElementDrag,
  showDiagnostics = false,
  diagnostics,
}) => {
  const stageRef = useRef<any>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);

  const handleDragStart = (elementId: string) => {
    setDraggedElement(elementId);
  };

  const handleDragEnd = (elementId: string, newPosition: Point) => {
    setDraggedElement(null);
    const element = elements.find(e => e.id === elementId);
    if (element && onElementDrag) {
      onElementDrag(element, newPosition);
    }
  };

  const renderPoint = (element: GeometryElement) => {
    const point = element.data as Point;
    const style = element.style || {};
    
    return (
      <Group key={element.id}>
        <Circle
          x={point.x}
          y={point.y}
          radius={element.highlight ? 8 : 5}
          fill={style.fill || (element.highlight ? '#ff6b6b' : '#4ecdc4')}
          stroke={style.stroke || '#2c3e50'}
          strokeWidth={style.strokeWidth || 2}
          opacity={style.opacity || 1}
          draggable={!!onElementDrag}
          onDragStart={() => handleDragStart(element.id)}
          onDragEnd={(e) => {
            const newPos = { x: e.target.x(), y: e.target.y() };
            handleDragEnd(element.id, newPos);
          }}
          onClick={() => onElementClick?.(element)}
        />
        {element.label && (
          <Text
            x={point.x + 12}
            y={point.y - 8}
            text={element.label}
            fontSize={14}
            fill="#2c3e50"
            fontFamily="Arial"
          />
        )}
      </Group>
    );
  };

  const renderLine = (element: GeometryElement) => {
    const line = element.data as GeometryLine;
    const style = element.style || {};
    
    // For now, we'll need to get the actual points from somewhere
    // This is a simplified version - you'd need to resolve the line to actual points
    const startPoint = { x: 0, y: 0 }; // Placeholder
    const endPoint = { x: 100, y: 100 }; // Placeholder
    
    return (
      <Line
        key={element.id}
        points={[startPoint.x, startPoint.y, endPoint.x, endPoint.y]}
        stroke={style.stroke || (element.highlight ? '#ff6b6b' : '#34495e')}
        strokeWidth={style.strokeWidth || (element.highlight ? 4 : 2)}
        opacity={style.opacity || 1}
        onClick={() => onElementClick?.(element)}
      />
    );
  };

  const renderCircle = (element: GeometryElement) => {
    const circle = element.data as GeometryCircle;
    const style = element.style || {};
    
    // Need to resolve center point from ID
    const center = { x: 0, y: 0 }; // Placeholder
    
    return (
      <Group key={element.id}>
        <Circle
          x={center.x}
          y={center.y}
          radius={circle.r}
          stroke={style.stroke || (element.highlight ? '#ff6b6b' : '#34495e')}
          strokeWidth={style.strokeWidth || (element.highlight ? 4 : 2)}
          fill="transparent"
          opacity={style.opacity || 1}
          onClick={() => onElementClick?.(element)}
        />
        {element.label && (
          <Text
            x={center.x + circle.r + 5}
            y={center.y - 8}
            text={element.label}
            fontSize={14}
            fill="#2c3e50"
            fontFamily="Arial"
          />
        )}
      </Group>
    );
  };

  const renderTriangle = (element: GeometryElement) => {
    const triangle = element.data as Triangle;
    const style = element.style || {};
    
    // Need to resolve triangle vertices from IDs
    const vertices = [
      { x: 0, y: 0 },   // Placeholder for triangle.a
      { x: 100, y: 0 }, // Placeholder for triangle.b
      { x: 50, y: 100 }, // Placeholder for triangle.c
    ];
    
    const points = vertices.flatMap(v => [v.x, v.y]);
    
    return (
      <Group key={element.id}>
        <Line
          points={points}
          closed
          stroke={style.stroke || (element.highlight ? '#ff6b6b' : '#34495e')}
          strokeWidth={style.strokeWidth || (element.highlight ? 4 : 2)}
          fill={style.fill || 'transparent'}
          opacity={style.opacity || 1}
          onClick={() => onElementClick?.(element)}
        />
        {element.label && (
          <Text
            x={vertices[0].x}
            y={vertices[0].y - 20}
            text={element.label}
            fontSize={14}
            fill="#2c3e50"
            fontFamily="Arial"
          />
        )}
      </Group>
    );
  };

  const renderElement = (element: GeometryElement) => {
    switch (element.type) {
      case 'point':
        return renderPoint(element);
      case 'line':
        return renderLine(element);
      case 'circle':
        return renderCircle(element);
      case 'triangle':
        return renderTriangle(element);
      default:
        return null;
    }
  };

  return (
    <div className="geometry-canvas">
      <Stage width={width} height={height} ref={stageRef}>
        <Layer>
          {elements.map(renderElement)}
        </Layer>
      </Stage>
      
      {showDiagnostics && diagnostics && (
        <div className="diagnostics-panel" style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          fontSize: '12px',
          maxWidth: '200px',
        }}>
          <pre>{diagnostics}</pre>
        </div>
      )}
    </div>
  );
};
