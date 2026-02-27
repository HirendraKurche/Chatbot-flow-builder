import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { Image as ImageIcon, ImageOff } from 'lucide-react';

export default function ImageNode({ data, selected }) {
    const [hasError, setHasError] = useState(false);

    // Reset error state if URL changes
    useEffect(() => {
        setHasError(false);
    }, [data?.imageUrl]);
    return (
        <div className={`shadow-lg rounded-lg bg-white overflow-hidden min-w-[250px] transition-all border-2 ${selected ? 'border-blue-500' : 'border-transparent'}`}>

            {/* Node Header */}
            <div className="bg-[#f0fdf4] px-4 py-2 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <ImageIcon size={16} className="text-green-700" />
                    <span className="font-bold text-sm text-gray-800">Send Image</span>
                </div>
                <div className="bg-white rounded-full p-1 shadow-sm">
                    {/* A small decorative icon */}
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
            </div>

            {/* Node Body */}
            <div className="p-4 bg-white flex justify-center items-center min-h-[120px]">
                {data?.imageUrl && !hasError ? (
                    <img
                        src={data.imageUrl}
                        alt="Node Media"
                        className="max-w-full max-h-[150px] rounded-md object-contain"
                        onError={() => setHasError(true)}
                    />
                ) : data?.imageUrl && hasError ? (
                    <div className="flex flex-col items-center justify-center text-red-400 gap-2">
                        <ImageOff size={32} />
                        <span className="text-xs">Invalid image link</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                        <ImageIcon size={32} />
                        <span className="text-xs">No image provided</span>
                    </div>
                )}
            </div>

            {/* Target Handle (Left) - Can have multiple incoming edges */}
            <Handle
                type="target"
                position={Position.Left}
                id="target"
                className="w-3 h-3 bg-white border-2 border-gray-400"
            />

            {/* Source Handle (Right) - Can have only ONE outgoing edge */}
            <Handle
                type="source"
                position={Position.Right}
                id="source"
                className="w-3 h-3 bg-white border-2 border-gray-400"
            />
        </div>
    );
}
