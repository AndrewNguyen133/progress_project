'use client';

import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';

// Custom edge with animated dashed line
export function AnimatedEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        strokeWidth: 2,
        strokeDasharray: '5,5',
        animation: 'flow 30s linear infinite',
      }}
    />
  );
}

// Custom edge with gradient
export function GradientEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        strokeWidth: 3,
        stroke: 'url(#gradient)',
      }}
    />
  );
}

// Add this to your SystemDesign component's return statement:
// <svg style={{ position: 'absolute', width: 0, height: 0 }}>
//   <defs>
//     <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
//       <stop offset="0%" stopColor="#ff0072" />
//       <stop offset="100%" stopColor="#00c6ff" />
//     </linearGradient>
//   </defs>
// </svg> 