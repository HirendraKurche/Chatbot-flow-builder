import React from 'react';
import NodesPanel from './NodesPanel';
import SettingsPanel from './SettingsPanel';

export default function Sidebar({ selectedNode, setSelectedNode, setNodes, takeSnapshot, nodes, edges }) {
    return (
        <aside className="w-80 border-l border-gray-200 bg-white flex flex-col shadow-sm z-10">
            {selectedNode ? (
                <SettingsPanel
                    selectedNode={selectedNode}
                    setNodes={setNodes}
                    setSelectedNode={setSelectedNode}
                    takeSnapshot={takeSnapshot}
                    nodes={nodes}
                    edges={edges}
                />
            ) : (
                <NodesPanel />
            )}
        </aside>
    );
}
