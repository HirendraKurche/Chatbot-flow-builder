import React from 'react';
import { MessageSquare, Image as ImageIcon } from 'lucide-react';

export default function NodesPanel() {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
                {/* Extensible: More node types can be added here in the future */}
                <div
                    className="border-2 border-blue-500 rounded-md p-3 flex flex-col items-center justify-center cursor-grab bg-white text-blue-500 hover:bg-blue-50 transition-colors shadow-sm"
                    onDragStart={(event) => onDragStart(event, 'textNode')}
                    draggable
                >
                    <MessageSquare size={24} className="mb-2" />
                    <span className="text-sm font-semibold">Message</span>
                </div>

                {/* New Extensible Image Node */}
                <div
                    className="border-2 border-green-500 rounded-md p-3 flex flex-col items-center justify-center cursor-grab bg-white text-green-500 hover:bg-green-50 transition-colors shadow-sm"
                    onDragStart={(event) => onDragStart(event, 'imageNode')}
                    draggable
                >
                    <ImageIcon size={24} className="mb-2" />
                    <span className="text-sm font-semibold">Image</span>
                </div>
            </div>
        </div>
    );
}
