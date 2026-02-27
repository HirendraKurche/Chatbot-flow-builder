/**
 * Mocks an API request to an LLM service.
 * @param {string|null} parentContext - The text content of the parent node to use as context
 * @returns {Promise<string>} The mocked AI suggestion
 */
export const fetchAISuggestion = async (parentContext) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!parentContext || parentContext.trim() === '') {
                resolve("Hi there! How can I help you today?");
            } else {
                // Return a contextual response (mock LLM behavior)
                const lowerContext = parentContext.toLowerCase();
                
                if (lowerContext.includes('order')) {
                    resolve("I can help with that! Please provide your order number.");
                } else if (lowerContext.includes('hello') || lowerContext.includes('hi')) {
                    resolve("Hello! What brings you here today?");
                } else if (lowerContext.includes('price') || lowerContext.includes('cost')) {
                    resolve("Our pricing depends on the specific plan. Would you like a breakdown?");
                } else {
                    // Generic contextual fallback
                    resolve(`That's interesting. Tell me more about "${parentContext.substring(0, 20)}..."`);
                }
            }
        }, 1500); // 1.5 seconds simulated network delay
    });
};
