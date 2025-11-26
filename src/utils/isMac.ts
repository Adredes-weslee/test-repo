export const isMac = (): boolean => {
    if (typeof window !== 'undefined') {
        // Add type assertion for navigator.userAgentData, which is an experimental API
        // and may not be in default TypeScript DOM typings.
        const nav = navigator as Navigator & { userAgentData?: { platform: string } };
        // Use userAgentData if available for modern browsers
        if (nav.userAgentData && nav.userAgentData.platform) {
            return nav.userAgentData.platform.toLowerCase().includes('mac');
        }
        // Fallback to older navigator.platform
        return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    }
    return false;
};