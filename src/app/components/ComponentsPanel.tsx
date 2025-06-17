'use client';

import { DragEvent } from 'react';

const components = [
  { type: 'database', label: 'Database', icon: '🗄️' },
  { type: 'service', label: 'Service', icon: '⚙️' },
  { type: 'api', label: 'API', icon: '🌐' },
  { type: 'queue', label: 'Queue', icon: '📨' },
  { type: 'cache', label: 'Cache', icon: '💾' },
  { type: 'loadBalancer', label: 'Load Balancer', icon: '⚖️' },
  { type: 'client', label: 'Client', icon: '💻' },
  { type: 'microservice', label: 'Microservice', icon: '🔧' },
];

export default function ComponentsPanel() {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 h-full bg-gray-100 p-4 border-r border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Components</h3>
      <div className="space-y-2">
        {components.map((component) => (
          <div
            key={component.type}
            className="flex items-center p-2 bg-white rounded shadow cursor-move hover:bg-gray-50"
            draggable
            onDragStart={(e) => onDragStart(e, component.type)}
          >
            <span className="text-2xl mr-2">{component.icon}</span>
            <span>{component.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 