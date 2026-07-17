const API_BASE = 'http://localhost:3000';
let currentToken = null;

// DOM Elements
const loginView = document.getElementById('login-view');
const signupView = document.getElementById('signup-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const createAppForm = document.getElementById('create-app-form');
const logoutBtn = document.getElementById('logout-btn');

const loginBtnSpinner = document.querySelector('#login-btn .spinner');
const loginBtnText = document.querySelector('#login-btn span');
const loginError = document.getElementById('login-error');

const signupBtnSpinner = document.querySelector('#signup-btn .spinner');
const signupBtnText = document.querySelector('#signup-btn span');
const signupError = document.getElementById('signup-error');

const createBtnSpinner = document.querySelector('#create-btn .spinner');
const createBtnText = document.querySelector('#create-btn span');
const createError = document.getElementById('create-error');
const appResultSection = document.getElementById('app-result-section');
const appsList = document.getElementById('apps-list');
const appsLoading = document.getElementById('apps-loading');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
signupForm.addEventListener('submit', handleSignup);
createAppForm.addEventListener('submit', handleCreateApp);
logoutBtn.addEventListener('click', handleLogout);

document.getElementById('show-signup').addEventListener('click', (e) => {
    e.preventDefault();
    loginView.classList.remove('active');
    setTimeout(() => {
        loginView.classList.add('hidden');
        signupView.classList.remove('hidden');
        signupView.classList.add('active');
    }, 400);
});

document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    signupView.classList.remove('active');
    setTimeout(() => {
        signupView.classList.add('hidden');
        loginView.classList.remove('hidden');
        loginView.classList.add('active');
    }, 400);
});

// Tab Switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(`tab-${tab.dataset.target}`).classList.add('active');
    });
});

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    setLoading(loginBtnSpinner, loginBtnText, true);
    loginError.textContent = '';

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailOrUserName: email, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        currentToken = data.accessToken;
        showDashboard();
        loadApplications();
    } catch (err) {
        loginError.textContent = err.message;
    } finally {
        setLoading(loginBtnSpinner, loginBtnText, false);
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const firstName = document.getElementById('signup-first-name').value;
    const lastName = document.getElementById('signup-last-name').value;
    const userName = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    setLoading(signupBtnSpinner, signupBtnText, true);
    signupError.textContent = '';

    try {
        const response = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, userName, email, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }

        // Auto login after signup
        document.getElementById('email').value = email;
        document.getElementById('password').value = password;
        document.getElementById('show-login').click();
        
        setTimeout(() => {
            loginForm.dispatchEvent(new Event('submit'));
        }, 500);

    } catch (err) {
        signupError.textContent = err.message;
    } finally {
        setLoading(signupBtnSpinner, signupBtnText, false);
    }
}

async function handleCreateApp(e) {
    e.preventDefault();
    const appName = document.getElementById('app-name').value;

    setLoading(createBtnSpinner, createBtnText, true);
    createError.textContent = '';
    appResultSection.classList.add('hidden');

    try {
        const response = await fetch(`${API_BASE}/applications`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify({ name: appName })
        });

        const appData = await response.json();
        
        if (!response.ok) {
            throw new Error(appData.message || 'Failed to create application');
        }

        displayAppDetails(appData);
        loadApplications(); // Refresh the list
    } catch (err) {
        createError.textContent = err.message;
    } finally {
        setLoading(createBtnSpinner, createBtnText, false);
    }
}

function displayAppDetails(app) {
    const appId = app.appId;
    const publicKey = app.publicKey;
    const jwksUrl = `${API_BASE}/applications/${appId}/.well-known/jwks.json`;

    document.getElementById('display-app-id').textContent = appId;
    document.getElementById('display-public-key').textContent = publicKey;
    
    const jwksLink = document.getElementById('display-jwks');
    jwksLink.href = jwksUrl;
    jwksLink.textContent = jwksUrl;

    document.querySelectorAll('.dyn-jwks').forEach(el => {
        el.textContent = jwksUrl;
    });

    appResultSection.classList.remove('hidden');
}

async function loadApplications() {
    appsList.innerHTML = '<div class="spinner" id="apps-loading"></div>';
    
    try {
        const response = await fetch(`${API_BASE}/applications`, {
            headers: {
                'Authorization': `Bearer ${currentToken}`
            }
        });
        const apps = await response.json();
        
        if (!response.ok) throw new Error('Failed to fetch apps');
        
        appsList.innerHTML = '';
        if (apps.length === 0) {
            appsList.innerHTML = '<div class="empty-state">No applications found. Create one below.</div>';
            return;
        }

        apps.forEach(app => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.innerHTML = `
                <h4>${app.name}</h4>
                <p title="${app.appId}">${app.appId}</p>
            `;
            card.addEventListener('click', () => displayAppDetails(app));
            appsList.appendChild(card);
        });
    } catch (err) {
        appsList.innerHTML = '<div class="error-msg">Failed to load applications.</div>';
    }
}

function handleLogout() {
    currentToken = null;
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('app-name').value = '';
    appResultSection.classList.add('hidden');
    loginError.textContent = '';
    createError.textContent = '';
    
    dashboardView.classList.remove('active');
    setTimeout(() => {
        dashboardView.classList.add('hidden');
        loginView.classList.remove('hidden');
        loginView.classList.add('active');
    }, 400); // Wait for fade out
}

function showDashboard() {
    loginView.classList.remove('active');
    setTimeout(() => {
        loginView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
        dashboardView.classList.add('active');
    }, 400);
}

function setLoading(spinner, textElement, isLoading) {
    if (isLoading) {
        spinner.classList.remove('hidden');
        textElement.style.opacity = '0';
    } else {
        spinner.classList.add('hidden');
        textElement.style.opacity = '1';
    }
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text);
    
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = originalText, 2000);
}

function copyCode(btn) {
    const text = btn.previousElementSibling.textContent;
    navigator.clipboard.writeText(text);
    
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = originalText, 2000);
}
