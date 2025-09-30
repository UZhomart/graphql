import { handleLogin } from "./app/handleAuth.js"
import { renderProfilePage } from "./components/profileComponent.js"

document.addEventListener('DOMContentLoaded', () => {
    const jwt = localStorage.getItem('JWT')
    if (jwt) {
        // Get user data from localStorage or fetch it
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        if (userData.id) {
            renderProfilePage(userData)
        } else {
            handleLogin()
        }
    } else {
        handleLogin()
    }
})