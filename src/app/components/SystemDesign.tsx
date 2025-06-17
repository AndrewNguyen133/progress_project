'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  ReactFlowInstance,
  NodeProps,
  EdgeProps,
  NodeTypes,
  EdgeTypes,
  updateEdge,
  Position,
  Handle,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Editable Node Component
const EditableNode = ({ data, id, type }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.label || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Determine handle positions based on node type
  const getHandles = () => {
    switch (type) {
      case 'input':
        return <Handle type="source" position={Position.Right} id="source" style={{ background: '#4285F4', width: 8, height: 8 }} />;
      case 'output':
        return <Handle type="target" position={Position.Left} id="target" style={{ background: '#4285F4', width: 8, height: 8 }} />;
      default:
        return (
          <>
            <Handle type="source" position={Position.Right} id="source" style={{ background: '#4285F4', width: 8, height: 8 }} />
            <Handle type="target" position={Position.Left} id="target" style={{ background: '#4285F4', width: 8, height: 8 }} />
          </>
        );
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(data.label || '');
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (data.onChange) {
      data.onChange(id, { label: editValue });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(data.label || '');
    }
  };

  // Auto-resize based on content
  const getNodeWidth = () => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth;
      return Math.max(120, textWidth + 40); // Minimum width of 120px
    }
    return 120;
  };

  // Google Material Design colors
  const getNodeColor = () => {
    switch (type) {
      case 'input':
        return '#E8F0FE'; // Light blue background
      case 'output':
        return '#FCE8E6'; // Light red background
      case 'database':
        return '#E6F4EA'; // Light green background
      case 'api':
        return '#FEF7E0'; // Light yellow background
      case 'service':
        return '#F3E8FD'; // Light purple background
      case 'queue':
        return '#E8EAED'; // Light gray background
      case 'cache':
        return '#F1F3F4'; // Light gray background
      case 'loadBalancer':
        return '#E8F0FE'; // Light blue background
      case 'cdn':
        return '#FCE8E6'; // Light red background
      case 'messageBroker':
        return '#E6F4EA'; // Light green background
      default:
        return '#FFFFFF'; // White background
    }
  };

  // Google Material Design text colors
  const getTextColor = () => {
    switch (type) {
      case 'input':
        return '#1A73E8'; // Google blue
      case 'output':
        return '#D93025'; // Google red
      case 'database':
        return '#188038'; // Google green
      case 'api':
        return '#B06000'; // Google yellow
      case 'service':
        return '#9334E6'; // Google purple
      case 'queue':
        return '#5F6368'; // Google gray
      case 'cache':
        return '#5F6368'; // Google gray
      case 'loadBalancer':
        return '#1A73E8'; // Google blue
      case 'cdn':
        return '#D93025'; // Google red
      case 'messageBroker':
        return '#188038'; // Google green
      default:
        return '#202124'; // Google dark gray
    }
  };

  return (
    <div 
      className="rounded-lg relative min-w-[120px]"
      style={{ 
        background: data.color || getNodeColor(),
        width: isEditing ? 'auto' : `${getNodeWidth()}px`,
        minHeight: '60px',
        padding: '16px',
        border: isEditing ? '2px solid #1A73E8' : '1px solid #DADCE0',
        boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        transition: 'all 0.2s ease',
        color: getTextColor(),
        fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
        fontSize: '14px',
        fontWeight: 500,
      }}
      onDoubleClick={handleDoubleClick}
    >
      {getHandles()}
      
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-none outline-none text-center"
          style={{ 
            fontSize: '14px',
            fontWeight: 500,
            color: getTextColor(),
            fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
          }}
          autoFocus
        />
      ) : (
        <div
          ref={textRef}
          className="text-center break-words"
          style={{ 
            fontSize: '14px', 
            lineHeight: '1.4',
            fontWeight: 500,
            color: getTextColor(),
            fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
          }}
        >
          {data.label || 'Double-click to edit'}
        </div>
      )}
    </div>
  );
};

// Custom node types - moved outside component to prevent recreation
const nodeTypes: NodeTypes = {
  input: EditableNode,
  default: EditableNode,
  output: EditableNode,
  database: EditableNode,
  api: EditableNode,
  service: EditableNode,
  queue: EditableNode,
  cache: EditableNode,
  loadBalancer: EditableNode,
  cdn: EditableNode,
  messageBroker: EditableNode,
};

// Custom edge types - moved outside component to prevent recreation
const edgeTypes: EdgeTypes = {
  default: ({ style }) => <div style={style} />,
};

// Color options for nodes - Google Material Design colors
const colorOptions = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Blue', value: '#E8F0FE' },
  { name: 'Red', value: '#FCE8E6' },
  { name: 'Green', value: '#E6F4EA' },
  { name: 'Yellow', value: '#FEF7E0' },
  { name: 'Purple', value: '#F3E8FD' },
  { name: 'Gray', value: '#F1F3F4' },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function SystemDesign() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
  }, []);

  const centerView = useCallback(() => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.fitView({ padding: 0.2 });
    }
  }, []);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      console.log('Connection attempt:', params);
      console.log('Current edges before:', edges);
      
      // Create a simple edge without custom types
      const newEdge: Edge = {
        ...params,
        id: `e${params.source}-${params.target}-${Date.now()}`,
        type: 'default',
        style: {
          stroke: '#6B7280',
          strokeWidth: 2,
        },
        source: params.source || '',
        target: params.target || '',
      };
      
      console.log('Creating new edge:', newEdge);
      setEdges((eds) => {
        const newEdges = addEdge(newEdge, eds);
        console.log('New edges after:', newEdges);
        return newEdges;
      });
    },
    [setEdges, edges],
  );

  const onConnectStart = useCallback((event: any, { nodeId, handleType }: any) => {
    console.log('Connection started:', { nodeId, handleType, event });
  }, []);

  const onConnectEnd = useCallback((event: any) => {
    console.log('Connection ended:', event);
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    },
    [setEdges],
  );

  const onEdgeDelete = useCallback(
    (edge: Edge) => {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    },
    [setEdges],
  );

  const onNodeDelete = useCallback(
    (node: Node) => {
      console.log('Deleting node:', node.id);
      console.log('Current nodes before deletion:', nodes);
      console.log('Current edges before deletion:', edges);
      
      setNodes((nds) => {
        const newNodes = nds.filter((n) => n.id !== node.id);
        console.log('Nodes after deletion:', newNodes);
        return newNodes;
      });
      
      setEdges((eds) => {
        const newEdges = eds.filter((e) => e.source !== node.id && e.target !== node.id);
        console.log('Edges after deletion:', newEdges);
        return newEdges;
      });
    },
    [setNodes, setEdges, nodes, edges],
  );

  const handleDeleteNode = useCallback(() => {
    console.log('Delete button clicked, selectedNode:', selectedNode);
    if (selectedNode) {
      console.log('Attempting to delete node:', selectedNode.id);
      
      // Direct deletion without going through the callback chain
      setNodes((currentNodes) => {
        const filteredNodes = currentNodes.filter((node) => node.id !== selectedNode.id);
        console.log('Nodes after direct deletion:', filteredNodes);
        return filteredNodes;
      });
      
      setEdges((currentEdges) => {
        const filteredEdges = currentEdges.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id);
        console.log('Edges after direct deletion:', filteredEdges);
        return filteredEdges;
      });
      
      setSelectedNode(null);
      console.log('Node deletion completed');
    } else {
      console.log('No node selected for deletion');
    }
  }, [selectedNode]);

  const deleteSelectedNode = useCallback(() => {
    console.log('deleteSelectedNode called, selectedNode:', selectedNode);
    if (selectedNode) {
      onNodeDelete(selectedNode);
      setSelectedNode(null);
    } else {
      console.log('No node selected for deletion');
    }
  }, [selectedNode, onNodeDelete]);

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    console.log('Key pressed:', event.key, 'Selected node:', selectedNode);
    if (event.key === 'Delete' && selectedNode) {
      console.log('Delete key pressed, deleting node:', selectedNode.id);
      event.preventDefault(); // Prevent default browser behavior
      handleDeleteNode();
    }
  }, [selectedNode, handleDeleteNode]);

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('Global keydown event:', event.key, 'Selected node:', selectedNode);
      if (event.key === 'Delete' && selectedNode) {
        console.log('Delete key detected, deleting node:', selectedNode.id);
        event.preventDefault();
        handleDeleteNode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNode, handleDeleteNode]);

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const updateNode = useCallback((nodeId: string, updates: { notes?: string; color?: string; label?: string }) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const newData = { ...node.data, ...updates };
          return {
            ...node,
            data: newData,
            style: {
              ...(node.style || {}),
              background: updates.color || (node.style?.background || '#E5E7EB'),
            },
          };
        }
        return node;
      })
    );
    // Update the selected node to reflect changes immediately
    setSelectedNode((prev) => {
      if (prev && prev.id === nodeId) {
        return {
          ...prev,
          data: { ...prev.data, ...updates },
          style: {
            ...(prev.style || {}),
            background: updates.color || (prev.style?.background || '#E5E7EB'),
          },
        };
      }
      return prev;
    });
  }, [setNodes]);

  // Initialize nodes with onChange handler
  useEffect(() => {
    const initialNodesWithHandler: Node[] = [
      {
        id: '1',
        type: 'input',
        data: { label: 'Input Node', onChange: updateNode },
        position: { x: 250, y: 25 },
        sourcePosition: Position.Right,
      },
      {
        id: '2',
        type: 'default',
        data: { label: 'Default Node', onChange: updateNode },
        position: { x: 100, y: 125 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: '3',
        type: 'output',
        data: { label: 'Output Node', onChange: updateNode },
        position: { x: 250, y: 250 },
        targetPosition: Position.Left,
      },
    ];
    setNodes(initialNodesWithHandler);
  }, [setNodes, updateNode]);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance.current) return;

      // Get the position where the node was dropped
      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label: `${type} node`,
          notes: '',
          color: '#E5E7EB',
          onChange: updateNode
        },
        style: { 
          background: '#E5E7EB', 
          color: '#111827', 
          border: '1px solid #9CA3AF', 
          padding: '10px', 
          borderRadius: '5px' 
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, reactFlowInstance, updateNode],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="w-full h-screen flex p-4 gap-4 bg-[#F8F9FA]">
      <div className="w-64 bg-white border-r border-[#DADCE0] p-6 rounded-lg shadow-sm h-full overflow-y-auto">
        <h3 className="text-[#202124] font-medium mb-6 text-lg font-['Google_Sans']">Components</h3>
        <div className="flex flex-col space-y-3">
          {Object.entries(nodeTypes).map(([key, type]) => (
            <div
              key={key}
              className="bg-white text-[#5F6368] p-4 rounded-lg cursor-move hover:bg-[#F1F3F4] transition-colors shadow-sm border border-[#DADCE0] flex items-center gap-3"
              draggable
              onDragStart={(e) => onDragStart(e, key)}
            >
              {key === 'input' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              )}
              {key === 'output' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              )}
              {key === 'database' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3"/>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                </svg>
              )}
              {key === 'api' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              )}
              {key === 'service' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              )}
              {key === 'queue' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16v2H4zM4 10h16v2H4zM4 16h16v2H4z"/>
                </svg>
              )}
              {key === 'cache' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              )}
              {key === 'loadBalancer' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/>
                </svg>
              )}
              {key === 'cdn' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              )}
              {key === 'messageBroker' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              )}
              {key === 'default' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              )}
              <span className="font-['Google_Sans'] font-medium">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</span>
            </div>
          ))}
        </div>
        <h3 className="text-[#202124] font-medium mt-6 mb-6 text-lg font-['Google_Sans']">Edge Types</h3>
        <div className="flex flex-col space-y-3">
          {Object.entries(edgeTypes).map(([key, type]) => (
            <div
              key={key}
              className="bg-white text-[#5F6368] p-4 rounded-lg cursor-move hover:bg-[#F1F3F4] transition-colors shadow-sm border border-[#DADCE0] flex items-center gap-3"
              draggable
              onDragStart={(e) => onDragStart(e, key)}
            >
              {key === 'default' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14"/>
                </svg>
              )}
              <span className="font-['Google_Sans'] font-medium">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 relative bg-white rounded-lg shadow-sm p-4 border border-[#DADCE0]">
        <div className="absolute top-6 left-4 z-10 flex gap-2">
          <button
            onClick={centerView}
            className="bg-white hover:bg-[#F1F3F4] text-[#5F6368] p-3 rounded-full border border-[#DADCE0] shadow-sm transition-colors"
            title="Center View"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
          <button
            onClick={() => setIsConnecting(!isConnecting)}
            className={`p-3 rounded-full border shadow-sm transition-colors ${
              isConnecting 
                ? 'bg-[#1A73E8] hover:bg-[#1557B0] text-white border-[#1A73E8]' 
                : 'bg-white hover:bg-[#F1F3F4] text-[#5F6368] border-[#DADCE0]'
            }`}
            title={isConnecting ? "Exit Connection Mode" : "Enter Connection Mode"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onInit={onInit}
          fitView
          className="rounded-lg"
          deleteKeyCode="Delete"
          multiSelectionKeyCode="Shift"
          connectionMode={ConnectionMode.Loose}
          defaultEdgeOptions={{
            style: { stroke: '#4285F4', strokeWidth: 2 },
            animated: false,
          }}
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#DADCE0" />
          <Controls className="bg-white border border-[#DADCE0] rounded-lg shadow-sm" />
          <MiniMap 
            className="bg-white border border-[#DADCE0] rounded-lg shadow-sm"
            nodeColor="#5F6368"
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        </ReactFlow>

        {selectedNode && (
          <div className="absolute top-4 right-4 w-80 bg-white border border-[#DADCE0] rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#202124] font-medium font-['Google_Sans']">Edit Node</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    console.log('Delete button clicked!');
                    console.log('Selected node:', selectedNode);
                    console.log('Current nodes:', nodes);
                    handleDeleteNode();
                  }}
                  className="bg-[#D93025] hover:bg-[#B31412] text-white px-3 py-1 rounded text-sm transition-colors font-['Google_Sans']"
                  title="Delete Node"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    console.log('Test button clicked!');
                    alert('Button click is working! Selected node: ' + (selectedNode ? selectedNode.id : 'none'));
                  }}
                  className="bg-[#1A73E8] hover:bg-[#1557B0] text-white px-3 py-1 rounded text-sm transition-colors font-['Google_Sans']"
                  title="Test Button"
                >
                  Test
                </button>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-[#5F6368] hover:text-[#202124]"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[#5F6368] text-sm mb-2 font-['Google_Sans']">Label</label>
                <input
                  type="text"
                  value={selectedNode.data.label}
                  onChange={(e) => updateNode(selectedNode.id, { label: e.target.value })}
                  className="w-full p-2 rounded bg-white text-[#202124] border border-[#DADCE0] focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] outline-none font-['Google_Sans']"
                  placeholder="Enter node label..."
                />
              </div>
              <div>
                <label className="block text-[#5F6368] text-sm mb-2 font-['Google_Sans']">Notes</label>
                <textarea
                  value={selectedNode.data.notes}
                  onChange={(e) => updateNode(selectedNode.id, { notes: e.target.value })}
                  className="w-full h-32 p-2 rounded bg-white text-[#202124] border border-[#DADCE0] focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] outline-none resize-none font-['Google_Sans']"
                  placeholder="Add notes about this node..."
                />
              </div>
              <div>
                <label className="block text-[#5F6368] text-sm mb-2 font-['Google_Sans']">Color</label>
                <div className="grid grid-cols-3 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updateNode(selectedNode.id, { color: color.value })}
                      className={`p-2 rounded border ${
                        selectedNode.data.color === color.value
                          ? 'border-[#1A73E8]'
                          : 'border-[#DADCE0]'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-[#DADCE0]">
                <p className="text-[#5F6368] text-xs font-['Google_Sans']">
                  Press <kbd className="px-1 py-0.5 bg-[#F1F3F4] rounded text-xs">Delete</kbd> to delete this node
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 