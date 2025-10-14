export const writeErrorMessage = (elementID, message) => {
    const errorElement = document.getElementById(elementID);
    if (errorElement) {
        errorElement.textContent = message
    }
}

export const checkAuth = () => {
    const token = localStorage.getItem('JWT');
    const currentUserId = localStorage.getItem('currentUserId');
    
    return {
        isAuthenticated: !!token,
        token,
        currentUserId: currentUserId ? parseInt(currentUserId) : null,
        error: !token ? 'Authentication token not found' : null
    };
}