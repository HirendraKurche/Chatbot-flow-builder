import React from 'react';
import toast from 'react-hot-toast';
import { Undo2, Redo2 } from 'lucide-react';
import { hasCycle } from './utils/graphValidation';

export default function Header({ nodes, edges, undo, redo, canUndo, canRedo }) {
    const handleSave = () => {
        // 1. Count the total number of nodes.
        const totalNodes = nodes.length;

        // 2. Count how many nodes have an empty target handle (no edges pointing to them).
        // An edge pointing to a node has its 'target' property equal to the node's 'id'.
        const targetedNodeIds = new Set(edges.map(edge => edge.target));

        let nodesWithEmptyTargetCount = 0;
        nodes.forEach(node => {
            if (!targetedNodeIds.has(node.id)) {
                nodesWithEmptyTargetCount++;
            }
        });

        // 3. Validation Rule 1:
        // If there are more than one nodes on the canvas AND more than one node has an empty target handle, the save must fail.
        const rule1Fails = totalNodes > 1 && nodesWithEmptyTargetCount > 1;

        // 4. Validation Rule 2 (Cycle Detection):
        // Fail if the graph contains an infinite loop (cycle)
        const rule2Fails = hasCycle(nodes, edges);

        if (rule2Fails) {
            toast.error('Cannot save flow: Infinite loop detected.');
        } else if (rule1Fails) {
            toast.error('Cannot save Flow');
        } else {
            toast.success('Flow saved successfully');
        }
    };

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-[#f3f4f6] border-b border-gray-200 shrink-0 z-20">
            <div className="font-bold text-gray-800 text-lg">Chatbot Flow Builder</div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md p-1 shadow-sm">
                    <button
                        onClick={undo}
                        disabled={!canUndo}
                        className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${canUndo ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo2 size={18} />
                    </button>
                    <div className="w-[1px] h-4 bg-gray-200"></div>
                    <button
                        onClick={redo}
                        disabled={!canRedo}
                        className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${canRedo ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo2 size={18} />
                    </button>
                </div>
                <button
                    className="px-6 py-2 bg-white border border-blue-500 text-blue-500 rounded-md font-semibold text-sm hover:bg-blue-50 transition-colors shadow-sm"
                    onClick={handleSave}
                >
                    Save Changes
                </button>
            </div>
        </header>
    );
}
