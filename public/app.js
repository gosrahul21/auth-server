const API_BASE = 'http://localhost:3000';
let currentToken = null;
let currentAppId = null;

// DOM Elements
const loginView = document.getElementById('login-view');
const signupView = document.getElementById('signup-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const createAppForm = document.getElementById('create-app-form');
const logoutBtn = document.getElementById('logout-btn');
const deleteAppBtn = document.getElementById('delete-app-btn');
const addRoleForm = document.getElementById('add-role-form');
const rolesContainer = document.getElementById('roles-container');
const addRoleBtnSpinner = document.querySelector('#add-role-btn .spinner');
const addRoleBtnText = document.querySelector('#add-role-btn span');

const googleConfigForm = document.getElementById('google-config-form');
const saveGoogleBtnSpinner = document.querySelector('#save-google-config-btn .spinner');
const saveGoogleBtnText = document.querySelector('#save-google-config-btn span');

const originsConfigForm = document.getElementById('origins-config-form');
const saveOriginsBtnSpinner = document.querySelector('#save-origins-btn .spinner');
const saveOriginsBtnText = document.querySelector('#save-origins-btn span');

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
deleteAppBtn.addEventListener('click', handleDeleteApp);
addRoleForm.addEventListener('submit', handleAddRole);
googleConfigForm.addEventListener('submit', handleSaveGoogleConfig);
originsConfigForm.addEventListener('submit', handleSaveOrigins);

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
        document.getElementById('result-app-name').innerHTML = `<span style="color: var(--success)">✓ Created:</span> ${appName}`;
    } catch (err) {
        createError.textContent = err.message;
    } finally {
        setLoading(createBtnSpinner, createBtnText, false);
    }
}

async function handleDeleteApp() {
    if (!currentAppId) return;
    if (!confirm('Are you sure you want to delete this application? All its users and roles will be permanently deleted.')) return;

    try {
        const response = await fetch(`${API_BASE}/applications/${currentAppId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${currentToken}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to delete application');
        }

        appResultSection.classList.add('hidden');
        currentAppId = null;
        loadApplications();
    } catch (err) {
        alert(err.message);
    }
}

function displayAppDetails(app) {
    const appId = app.appId;
    currentAppId = appId;
    const publicKey = app.publicKey;
    const jwksUrl = `${API_BASE}/applications/${appId}/.well-known/jwks.json`;

    document.getElementById('result-app-name').textContent = app.name;
    document.getElementById('display-app-id').textContent = appId;
    document.getElementById('display-public-key').textContent = publicKey;
    
    document.getElementById('google-client-id').value = app.googleClientId || '';
    document.getElementById('google-client-secret').value = app.googleClientSecret || '';
    document.getElementById('allowed-origins').value = app.allowedOrigins ? app.allowedOrigins.join(', ') : '';
    
    const jwksLink = document.getElementById('display-jwks');
    jwksLink.href = jwksUrl;
    jwksLink.textContent = jwksUrl;

    document.querySelectorAll('.dyn-jwks').forEach(el => {
        el.textContent = jwksUrl;
    });

    appResultSection.classList.remove('hidden');
    loadRoles(appId);
}

// --- ROLES MANAGEMENT ---

async function loadRoles(appId) {
    rolesContainer.innerHTML = '<div class="spinner" id="roles-loading"></div>';
    try {
        const res = await fetch(`${API_BASE}/applications/${appId}/roles`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        const roles = await res.json();
        if (!res.ok) throw new Error('Failed to load roles');

        rolesContainer.innerHTML = '';
        if (roles.length === 0) {
            rolesContainer.innerHTML = '<div class="empty-state">No roles found.</div>';
            return;
        }

        roles.forEach(role => {
            const el = document.createElement('div');
            el.className = 'role-item';
            el.innerHTML = `
                <input type="text" class="role-name-input" value="${role.name}" data-id="${role.id}" />
                <div class="role-actions">
                    <button class="role-btn update-btn" onclick="handleUpdateRole('${role.id}', this)">Save</button>
                    <button class="role-btn delete" onclick="handleDeleteRole('${role.id}')">Delete</button>
                </div>
            `;
            rolesContainer.appendChild(el);
        });
    } catch (err) {
        rolesContainer.innerHTML = `<div class="error-msg">${err.message}</div>`;
    }
}

async function handleSaveGoogleConfig(e) {
    e.preventDefault();
    if (!currentAppId) return;

    const clientId = document.getElementById('google-client-id').value;
    const clientSecret = document.getElementById('google-client-secret').value;

    setLoading(saveGoogleBtnSpinner, saveGoogleBtnText, true);

    try {
        const res = await fetch(`${API_BASE}/applications/${currentAppId}/google-oauth`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                googleClientId: clientId,
                googleClientSecret: clientSecret
            })
        });
        if (!res.ok) throw new Error('Failed to update Google Config');
        
        const data = await res.json();
        alert(data.message);
    } catch (err) {
        alert(err.message);
    } finally {
        setLoading(saveGoogleBtnSpinner, saveGoogleBtnText, false);
    }
}

async function handleSaveOrigins(e) {
    e.preventDefault();
    if (!currentAppId) return;

    const originsInput = document.getElementById('allowed-origins').value;
    const origins = originsInput.split(',').map(o => o.trim()).filter(o => o.length > 0);

    setLoading(saveOriginsBtnSpinner, saveOriginsBtnText, true);

    try {
        const res = await fetch(`${API_BASE}/applications/${currentAppId}/origins`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ allowedOrigins: origins })
        });
        if (!res.ok) throw new Error('Failed to update Allowed Origins');
        
        const data = await res.json();
        alert(data.message);
    } catch (err) {
        alert(err.message);
    } finally {
        setLoading(saveOriginsBtnSpinner, saveOriginsBtnText, false);
    }
}

async function handleAddRole(e) {
    e.preventDefault();
    if (!currentAppId) return;
    const nameInput = document.getElementById('new-role-name');
    const name = nameInput.value;

    setLoading(addRoleBtnSpinner, addRoleBtnText, true);

    try {
        const res = await fetch(`${API_BASE}/applications/${currentAppId}/roles`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        if (!res.ok) throw new Error('Failed to create role');
        
        nameInput.value = '';
        loadRoles(currentAppId);
    } catch (err) {
        alert(err.message);
    } finally {
        setLoading(addRoleBtnSpinner, addRoleBtnText, false);
    }
}

async function handleUpdateRole(roleId, btnElement) {
    if (!currentAppId) return;
    const inputEl = btnElement.closest('.role-item').querySelector('.role-name-input');
    const newName = inputEl.value;
    
    const originalText = btnElement.textContent;
    btnElement.textContent = '...';

    try {
        const res = await fetch(`${API_BASE}/applications/${currentAppId}/roles/${roleId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName })
        });
        if (!res.ok) throw new Error('Failed to update role');
        
        btnElement.textContent = 'Saved!';
        setTimeout(() => btnElement.textContent = originalText, 1500);
    } catch (err) {
        alert(err.message);
        btnElement.textContent = originalText;
    }
}

async function handleDeleteRole(roleId) {
    if (!currentAppId) return;
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
        const res = await fetch(`${API_BASE}/applications/${currentAppId}/roles/${roleId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${currentToken}`
            }
        });
        if (!res.ok) throw new Error('Failed to delete role');
        
        loadRoles(currentAppId);
    } catch (err) {
        alert(err.message);
    }
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
