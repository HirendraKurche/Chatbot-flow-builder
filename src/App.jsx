import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    Controls,
    Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Toaster } from 'react-hot-toast';

import Header from './Header';
import Sidebar from './Sidebar';
import TextNode from './TextNode';
import ImageNode from './ImageNode';
import useUndoRedo from './hooks/useUndoRedo';

// Generate a unique ID for new nodes
let id = 0;
const getId = () => `dndnode_${id++}`;

function FlowBuilder() {
    const reactFlowWrapper = useRef(null);
    const {
        nodes, setNodes, onNodesChange,
        edges, setEdges, onEdgesChange,
        undo, redo, takeSnapshot, canUndo, canRedo
    } = useUndoRedo([], []);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    // Manage the global state for the selected node
    const [selectedNode, setSelectedNode] = useState(null);

    // We use useMemo to avoid recreating the nodeTypes object on every render
    const nodeTypes = useMemo(() => ({ textNode: TextNode, imageNode: ImageNode }), []);

    // Global keyboard shortcuts for Undo/Redo
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Prevent undo/redo if the user is typing in an input or textarea
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const isUndo = (isMac ? event.metaKey : event.ctrlKey) && event.key.toLowerCase() === 'z' && !event.shiftKey;
            const isRedo = (isMac ? event.metaKey : event.ctrlKey) && (event.key.toLowerCase() === 'y' || (event.key.toLowerCase() === 'z' && event.shiftKey));

            if (isUndo) {
                event.preventDefault();
                undo();
            } else if (isRedo) {
                event.preventDefault();
                redo();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    const onConnect = useCallback(
        (params) => {
            // Add restriction: A source handle can only have ONE outgoing edge.
            // We check if there's already an edge originating from the same source node.
            const hasOutgoingEdge = edges.some(edge => edge.source === params.source);
            if (hasOutgoingEdge) {
                // Technically, react flow with valid connection is better, 
                // but guarding here prevents the connection from being created programmatically too.
                return;
            }
            takeSnapshot(); // Snapshot before adding the edge
            setEdges((eds) => addEdge(params, eds));
        },
        [edges, setEdges, takeSnapshot]
    );

    // strict restriction at UI level (prevents dragging and snapping)
    const isValidConnection = useCallback(
        (connection) => {
            // Find if there's already an edge with this source
            const hasOutgoingEdge = edges.some(edge => edge.source === connection.source);
            // We return false if there's an outgoing edge, meaning the connection is invalid
            return !hasOutgoingEdge;
        },
        [edges]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            // Check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            // Set default data based on the node type
            const defaultData = type === 'imageNode'
                ? { imageUrl: '' }
                : { label: `text message` };

            const newNode = {
                id: getId(),
                type,
                position,
                data: defaultData,
            };

            takeSnapshot(); // Snapshot before dropping the new node
            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes, takeSnapshot]
    );

    // Listen to node selection to show settings panel
    const onSelectionChange = useCallback((elements) => {
        const selectedNodes = elements.nodes;
        if (selectedNodes.length === 1) {
            setSelectedNode(selectedNodes[0]);
        } else {
            setSelectedNode(null);
        }
    }, []);

    return (
        <div className="flex flex-col h-screen w-full bg-gray-50 font-sans">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Header with Save Button & Validation */}
            <Header
                nodes={nodes}
                edges={edges}
                undo={undo}
                redo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
            />

            {/* Main Content: Canvas & Sidebar */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* React Flow Canvas */}
                <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
                    {/* Empty State Overlay */}
                    {nodes.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-sm border border-gray-100 text-gray-500 font-medium">
                                Drag a node from the right panel to start building.
                            </div>
                        </div>
                    )}

                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        nodeTypes={nodeTypes}
                        onSelectionChange={onSelectionChange}
                        isValidConnection={isValidConnection}
                        defaultEdgeOptions={{
                            animated: true,
                            type: 'smoothstep',
                            style: { strokeWidth: 2, stroke: '#9ca3af' }
                        }}
                        fitView
                        className="bg-gray-50"
                    >
                        <Background color="#ccc" gap={16} size={1} />
                        <Controls />
                    </ReactFlow>
                </div>

                {/* Dynamic Sidebar */}
                <Sidebar
                    selectedNode={selectedNode}
                    setSelectedNode={setSelectedNode}
                    setNodes={setNodes}
                    takeSnapshot={takeSnapshot}
                    nodes={nodes}
                    edges={edges}
                />
            </div>
        </div>
    );
}

export default function App() {
    return (
        <ReactFlowProvider>
            <FlowBuilder />
        </ReactFlowProvider>
    );
}
