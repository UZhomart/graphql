import { submitLogin } from "../api/authRequests.js"
import { renderLoginPage } from "../components/authComponent.js"
import { writeErrorMessage } from "../utils/error.js"
import { renderProfilePage } from "../components/profileComponent.js"
import { fetchGraphQL } from "../api/graphqlRequests.js"
import { GET_USER_PROFILE_INFO } from "../api/graphql.js"

export const handleLogin = () => {
    renderLoginPage()
    const form = document.getElementById("login-form")
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const credentials = {
            username: form?.username.value,
            password: form?.password.value,
        }
        try {
            const response = await submitLogin(credentials)
            if (response.error) {
                throw response.error
            }
            localStorage.setItem('JWT', response)
            
            // Fetch user data and render profile
            const userResponse = await fetchGraphQL(GET_USER_PROFILE_INFO, {}, response)
            if (userResponse.errors) {
                throw userResponse.errors[0].message
            }
            
            const user = userResponse.data.user[0]
            localStorage.setItem('userData', JSON.stringify(user))
            localStorage.setItem('currentUserId', user.id)
            
            renderProfilePage(user)
        } catch (error) {
            writeErrorMessage("login-error", error)
        }
    })
}

export const handleLogout = () => {
    localStorage.removeItem('JWT')
    localStorage.removeItem('userData')
    localStorage.removeItem('currentUserId')
    localStorage.removeItem('searchedUserId')
    document.body.innerHTML = ``
    handleLogin()
}
