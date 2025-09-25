import { writeErrorMessage } from "../utils/error.js";

export const renderLoginPage = () => {
    const container = document.createElement('div');
    container.innerHTML = /*html*/`
    <div class="login-container">
        <div class="login-background">
            <div class="login-particles"></div>
        </div>
        <div class="login-content">
            <div class="login-header">
                <div class="login-logo">
                    <div class="logo-icon">TS</div>
                    <h1>Dashboard</h1>
                </div>
                <p class="login-subtitle">Tomorrow School Learning Platform</p>
            </div>
            <form class="login-card" id="login-form">
                <div class="input-group">
                    <div class="input-icon">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <input type="text" id="username" placeholder="Username or Email" required/>
                </div>
                <div class="input-group">
                    <div class="input-icon">
                        <i class="fa-solid fa-lock"></i>
                    </div>
                    <input type="password" id="password" placeholder="Password" required/>
                </div>
                <span class="error" id="login-error"></span>
                <button id="login-button" class="btn login-btn">
                    <span>Sign In</span>
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </form>
            <div class="login-footer">
                <p>Secure authentication powered by Tomorrow School</p>
            </div>
        </div>
    </div>`

    document.body.appendChild(container);

    // empty the error message
    document.getElementById('username')?.addEventListener("focus", () => {
        writeErrorMessage("login-error", "")
    })
    document.getElementById('password')?.addEventListener("focus", () => {
        writeErrorMessage("login-error", "")
    })
}
