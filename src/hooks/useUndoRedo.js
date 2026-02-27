import { useState, useCallback } from 'react';
import { useNodesState, useEdgesState } from 'reactflow';

export default function useUndoRedo(initialNodes = [], initialEdges = []) {
    // We wrap React Flow's state hooks so we can easily access 'present' state
    const [nodes, setNodes, onNodesChangeReactFlow] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChangeReactFlow] = useEdgesState(initialEdges);

    const [past, setPast] = useState([]);
    const [future, setFuture] = useState([]);

    const takeSnapshot = useCallback(() => {
        setPast((prev) => {
            const newPast = [
                ...prev,
                {
                    nodes: JSON.parse(JSON.stringify(nodes)),
                    edges: JSON.parse(JSON.stringify(edges)),
                },
            ];
            // Optional: Limit history to 50 items to prevent memory issues
            if (newPast.length > 50) newPast.shift();
            return newPast;
        });
        setFuture([]);
    }, [nodes, edges]);

    const undo = useCallback(() => {
        if (past.length === 0) return;

        const previousState = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        setFuture((prev) => [
            {
                nodes: JSON.parse(JSON.stringify(nodes)),
                edges: JSON.parse(JSON.stringify(edges)),
            },
            ...prev,
        ]);
        setPast(newPast);

        setNodes(previousState.nodes);
        setEdges(previousState.edges);
    }, [past, nodes, edges, setNodes, setEdges]);

    const redo = useCallback(() => {
        if (future.length === 0) return;

        const nextState = future[0];
        const newFuture = future.slice(1);

        setPast((prev) => [
            ...prev,
            {
                nodes: JSON.parse(JSON.stringify(nodes)),
                edges: JSON.parse(JSON.stringify(edges)),
            },
        ]);
        setFuture(newFuture);

        setNodes(nextState.nodes);
        setEdges(nextState.edges);
    }, [future, nodes, edges, setNodes, setEdges]);

    // Intercept default changes (like deletions via Backspace) to take snapshots
    const onNodesChange = useCallback((changes) => {
        if (changes.some((c) => c.type === 'remove')) {
            takeSnapshot();
        }
        onNodesChangeReactFlow(changes);
    }, [takeSnapshot, onNodesChangeReactFlow]);

    const onEdgesChange = useCallback((changes) => {
        if (changes.some((c) => c.type === 'remove')) {
            takeSnapshot();
        }
        onEdgesChangeReactFlow(changes);
    }, [takeSnapshot, onEdgesChangeReactFlow]);

    return {
        nodes,
        setNodes,
        onNodesChange,
        edges,
        setEdges,
        onEdgesChange,
        undo,
        redo,
        takeSnapshot,
        canUndo: past.length > 0,
        canRedo: future.length > 0,
    };
}
