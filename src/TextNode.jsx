import React from 'react';
import { Handle, Position } from 'reactflow';
import { MessageSquare } from 'lucide-react';

export default function TextNode({ data, selected }) {
    return (
        <div className={`shadow-lg rounded-lg bg-white overflow-hidden min-w-[250px] transition-all border-2 ${selected ? 'border-blue-500' : 'border-gray-200'}`}>

            {/* Node Header */}
            <div className="bg-[#aee6e6] px-4 py-2 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-gray-700" />
                    <span className="font-bold text-sm text-gray-800">Send Message</span>
                </div>
                <div className="bg-white rounded-full p-1 shadow-sm">
                    {/* A small decorative icon to represent whatsapp typical in these flows */}
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
            </div>

            {/* Node Body */}
            <div className="p-4 bg-white">
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {data?.label || 'text node'}
                </div>
            </div>

            {/* Target Handle (Left) - Can have multiple incoming edges */}
            <Handle
                type="target"
                position={Position.Left}
                id="target"
                className="w-3 h-3 bg-white border-2 border-gray-400"
            />

            {/* Source Handle (Right) - Can have only ONE outgoing edge */}
            {/* The restriction logic is enforced in the App.jsx onConnect and isValidConnection */}
            <Handle
                type="source"
                position={Position.Right}
                id="source"
                className="w-3 h-3 bg-white border-2 border-gray-400"
            />
        </div>
    );
}
