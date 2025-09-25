import { AUTH_URL } from "../config.js"

export const submitLogin = async (credentials) => {
    // Safe encoding for non-Latin1 characters
    const encodeCredentials = (username, password) => {
        try {
            // First try regular btoa
            return btoa(username + ":" + password);
        } catch (error) {
            // If btoa fails, use encodeURIComponent + btoa
            return btoa(encodeURIComponent(username) + ":" + encodeURIComponent(password));
        }
    };

    const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${encodeCredentials(credentials.username, credentials.password)}`
        }
    });
    return response.json();
}