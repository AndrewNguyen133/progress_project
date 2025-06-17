'use client';

import { Handle, Position } from 'reactflow';

const nodeTypes = {
  database: ({ data }: { data: { label: string } }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center">
        <div className="text-2xl mr-2">🗄️</div>
        <div className="font-bold">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  ),
  service: ({ data }: { data: { label: string } }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-500">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center">
        <div className="text-2xl mr-2">⚙️</div>
        <div className="font-bold">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  ),
  api: ({ data }: { data: { label: string } }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-500">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center">
        <div className="text-2xl mr-2">🌐</div>
        <div className="font-bold">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  ),
  queue: ({ data }: { data: { label: string } }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-yellow-500">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center">
        <div className="text-2xl mr-2">📨</div>
        <div className="font-bold">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  ),
  cache: ({ data }: { data: { label: string } }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-red-500">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center">
        <div className="text-2xl mr-2">💾</div>
        <div className="font-bold">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  ),
  loadBalancer: ({ data }: { data: { label: string } }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-orange-500">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center">
        <div className="text-2xl mr-2">⚖️</div>
        <div className="font-bold">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  ),
  client: ({ data }: { data: { label: string } }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-500">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center">
        <div className="text-2xl mr-2">💻</div>
        <div className="font-bold">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  ),
};

export default nodeTypes; 