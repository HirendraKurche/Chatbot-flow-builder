/**
 * Constructs an adjacency list representing the directed graph of nodes.
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @returns {Object} Adjacency list where keys are node IDs and values are arrays of target node IDs.
 */
export const buildGraph = (nodes, edges) => {
    const graph = {};

    // Initialize an empty adjacency list for every node
    nodes.forEach((node) => {
        graph[node.id] = [];
    });

    // Populate the adjacency list based on edges
    edges.forEach((edge) => {
        if (graph[edge.source]) {
            graph[edge.source].push(edge.target);
        }
    });

    return graph;
};

/**
 * Detects if there is a cycle in the directed graph using Depth-First Search (DFS).
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @returns {boolean} True if a cycle is detected, false otherwise.
 */
export const hasCycle = (nodes, edges) => {
    const graph = buildGraph(nodes, edges);
    
    // Track visited nodes and nodes currently in the recursion stack
    const visited = new Set();
    const recursionStack = new Set();

    const dfs = (nodeId) => {
        visited.add(nodeId);
        recursionStack.add(nodeId);

        const neighbors = graph[nodeId] || [];
        for (const neighborId of neighbors) {
            // If the neighbor hasn't been visited, recursively visit it
            if (!visited.has(neighborId)) {
                if (dfs(neighborId)) return true;
            } 
            // If the neighbor is already in the recursion stack, we found a cycle
            else if (recursionStack.has(neighborId)) {
                return true;
            }
        }

        // Remove the node from the recursion stack before returning
        recursionStack.delete(nodeId);
        return false;
    };

    // Check for cycles starting from each node (handles disconnected components)
    for (const node of nodes) {
        if (!visited.has(node.id)) {
            if (dfs(node.id)) return true;
        }
    }

    return false;
};
