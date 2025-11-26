export const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    // Handles YYYY-MM-DD and ISO string date parts.
    const datePart = dateString.split('T')[0];
    const parts = datePart.split('-');
    if (parts.length !== 3) return dateString; // Fallback for unexpected formats

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in Date constructor
    const day = parseInt(parts[2], 10);
    
    // Check for invalid date components
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return dateString;
    }

    const date = new Date(year, month, day);

    if (isNaN(date.getTime())) {
        return dateString; // Return original string if date is invalid
    }

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};
