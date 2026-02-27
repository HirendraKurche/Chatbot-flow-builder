import { toPng } from 'html-to-image';
import { getNodesBounds, getViewportForBounds } from 'reactflow';

/**
 * Downloads the current React Flow canvas as a PNG image.
 * 
 * @param {Array} nodes - All current React Flow nodes
 * @returns {Promise<void>} 
 */
export const downloadCanvasAsImage = async (nodes) => {
    // 1. Calculate the bounding box of all nodes to ensure we capture everything
    const nodesBounds = getNodesBounds(nodes);

    // Minimum padding around the captured image
    const padding = 50;

    // React Flow viewport dimensions to base the scale on (Standard baseline size)
    const imageWidth = nodesBounds.width + padding * 2;
    const imageHeight = nodesBounds.height + padding * 2;

    // Determine the viewport transform needed to frame all nodes exactly within these dimensions
    const viewport = getViewportForBounds(
        nodesBounds,
        imageWidth,
        imageHeight,
        0.5, // minZoom
        2    // maxZoom
    );

    // 2. Select the React Flow viewport DOM node.
    // React Flow manages its pan/zoom layer in a div with the class .react-flow__viewport
    const viewportNode = document.querySelector('.react-flow__viewport');

    if (!viewportNode) {
        throw new Error("Could not find React Flow viewport in the DOM.");
    }

    // 3. Convert the DOM element to a PNG using the calculated viewport transformations
    const dataUrl = await toPng(viewportNode, {
        backgroundColor: '#f9fafb', // Matching tailwind bg-gray-50 from App.jsx
        width: imageWidth,
        height: imageHeight,
        style: {
            // Force the captured element's dimensions and transform
            width: String(imageWidth),
            height: String(imageHeight),
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
    });

    // 4. Trigger the download programmatically
    const link = document.createElement('a');
    link.download = 'chatbot-flow.png';
    link.href = dataUrl;
    link.click();
};
