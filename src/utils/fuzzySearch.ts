
export const fuzzySearch = (query: string, text: string): boolean => {
    if (!query) {
        return true;
    }
    
    const lowerQuery = query.toLowerCase();
    const lowerText = text.toLowerCase();
    let queryIndex = 0;
    
    for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
        if (lowerText[i] === lowerQuery[queryIndex]) {
            queryIndex++;
        }
    }
    
    return queryIndex === lowerQuery.length;
};
