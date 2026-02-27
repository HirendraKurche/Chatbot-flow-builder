import React, { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { fetchAISuggestion } from './utils/aiService';
import { getParentNodeText } from './utils/graphUtils';

export default function SettingsPanel({ selectedNode, setNodes, setSelectedNode, takeSnapshot, nodes, edges }) {
    const typingRef = React.useRef(false);
    const timeoutRef = React.useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Derive the active node directly from the global state to ensure real-time input updates (prevents cursor jumping/lag)
    const activeNode = nodes?.find((n) => n.id === selectedNode?.id) || selectedNode;

    // Update the text in real-time
    const handleChange = (e) => {
        // Take a snapshot before the typing burst starts
        if (!typingRef.current) {
            if (takeSnapshot) takeSnapshot();
            typingRef.current = true;
        }

        const newText = e.target.value;

        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === activeNode.id) {
                    // It's important to create a new object here in order to notify React Flow about the change
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: newText,
                        },
                    };
                }
                return node;
            })
        );

        // Reset the typing burst flag after 1000ms of inactivity
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            typingRef.current = false;
        }, 1000);
    };

    const handleGenerateAI = async () => {
        setIsGenerating(true);
        try {
            // Take snapshot before applying AI suggestion
            if (takeSnapshot) takeSnapshot();

            // 1. Get Context
            const parentContext = getParentNodeText(selectedNode.id, nodes, edges);

            // 2. Fetch Generation
            const suggestion = await fetchAISuggestion(parentContext);

            // 3. Update Node State
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === activeNode.id) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                label: suggestion,
                            },
                        };
                    }
                    return node;
                })
            );
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Settings Header */}
            <div className="border-b border-gray-200 p-4 flex items-center relative">
                <button
                    onClick={() => setSelectedNode(null)}
                    className="absolute left-4 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-base font-semibold text-center w-full">Message</h2>
            </div>

            {/* Settings Body */}
            <div className="p-4 flex-1">
                {activeNode?.type === 'textNode' && (
                    <>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Text</label>
                        <textarea
                            value={activeNode?.data?.label || ''}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-3"
                        />
                        <button
                            onClick={handleGenerateAI}
                            disabled={isGenerating}
                            className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-md font-medium text-sm transition-all duration-300 ${isGenerating
                                ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-md hover:from-purple-600 hover:to-indigo-600'
                                }`}
                        >
                            <Sparkles size={16} className={isGenerating ? 'animate-pulse' : ''} />
                            {isGenerating ? 'Generating...' : '✨ Auto-Suggest Reply'}
                        </button>
                    </>
                )}

                {activeNode?.type === 'imageNode' && (
                    <>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Image URL</label>
                        <input
                            type="text"
                            placeholder="https://example.com/image.png"
                            value={activeNode?.data?.imageUrl || ''}
                            onChange={(e) => {
                                // Take a snapshot before the typing burst starts
                                if (!typingRef.current) {
                                    if (takeSnapshot) takeSnapshot();
                                    typingRef.current = true;
                                }

                                let newUrl = e.target.value;

                                // Auto-correct Google Image search links to direct links if possible
                                try {
                                    if (newUrl.includes('google.com/imgres')) {
                                        const urlObj = new URL(newUrl);
                                        const imgurlParam = urlObj.searchParams.get('imgurl');
                                        if (imgurlParam) {
                                            newUrl = imgurlParam;
                                        }
                                    }
                                } catch (err) {
                                    // ignore invalid urls while typing
                                }

                                setNodes((nds) =>
                                    nds.map((node) => {
                                        if (node.id === activeNode.id) {
                                            return {
                                                ...node,
                                                data: { ...node.data, imageUrl: newUrl },
                                            };
                                        }
                                        return node;
                                    })
                                );

                                // Reset the typing burst flag after 1000ms of inactivity
                                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                                timeoutRef.current = setTimeout(() => {
                                    typingRef.current = false;
                                }, 1000);
                            }}
                            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                    </>
                )}
            </div>
        </div>
    );
}
