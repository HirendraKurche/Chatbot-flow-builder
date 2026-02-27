/**
 * Traverses the graph edges to find the parent node of a given node.
 * Since our flow builder restricts nodes to having 1 source edge, a target node usually has 1 parent (though it could have multiple incoming if the UI permitted). We look for any incoming edge.
 *
 * @param {string} currentNodeId - ID of the currently selected node
 * @param {Array} nodes - Array of all React Flow nodes
 * @param {Array} edges - Array of all React Flow edges
 * @returns {string|null} The `data.label` of the parent node, or null if no parent exists.
 */
export const getParentNodeText = (currentNodeId, nodes, edges) => {
    // Find an edge where the target is our current node
    const incomingEdge = edges.find((edge) => edge.target === currentNodeId);
    
    if (!incomingEdge) {
        return null;
    }

    // Find the node that corresponds to the source of that edge
    const parentNode = nodes.find((node) => node.id === incomingEdge.source);

    if (parentNode && parentNode.type === 'textNode') {
        return parentNode.data?.label || null;
    }
    
    return null; // Return null if parent isn't a textNode (e.g. imageNode) or doesn't have label
};
