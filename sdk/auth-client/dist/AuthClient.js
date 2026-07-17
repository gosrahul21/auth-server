"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthClient = void 0;
class AuthClient {
    constructor(options) {
        if (!options.appId) {
            throw new Error("appId is required to initialize AuthClient");
        }
        this.appId = options.appId;
        this.serverUrl = options.serverUrl || "http://localhost:3000";
        this.tokenStorageKey = options.tokenStorageKey || "auth_access_token";
    }
    /**
     * Retrieves the current access token from localStorage.
     */
    getToken() {
        return localStorage.getItem(this.tokenStorageKey);
    }
    /**
     * Clears the session.
     */
    logout() {
        localStorage.removeItem(this.tokenStorageKey);
    }
    /**
     * Login using email and password.
     */
    login(emailOrUserName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.serverUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrUserName, password })
            });
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            localStorage.setItem(this.tokenStorageKey, data.accessToken);
            return data.accessToken;
        });
    }
    /**
     * Signup a new user.
     */
    signup(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.serverUrl}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.assign(Object.assign({}, user), { appId: this.appId }))
            });
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }
            localStorage.setItem(this.tokenStorageKey, data.accessToken);
            return data.accessToken;
        });
    }
    /**
     * Inject Google Script and render the Sign In button.
     */
    renderGoogleButton(containerSelector, options) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            throw new Error(`Container ${containerSelector} not found`);
        }
        // 1. Ensure Google script is loaded
        if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
            const script = document.createElement('script');
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = () => this.initializeGoogleClient(container, options);
            document.head.appendChild(script);
        }
        else {
            // If already loaded
            if (window.google && window.google.accounts) {
                this.initializeGoogleClient(container, options);
            }
            else {
                // Wait for it to load
                setTimeout(() => this.renderGoogleButton(containerSelector, options), 100);
            }
        }
    }
    initializeGoogleClient(container, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appResponse = yield fetch(`${this.serverUrl}/applications/${this.appId}/public-config`);
                if (!appResponse.ok) {
                    throw new Error("Failed to load application public config");
                }
                const appConfig = yield appResponse.json();
                if (!appConfig.googleClientId) {
                    throw new Error("Google Client ID is not configured for this application");
                }
                window.google.accounts.id.initialize({
                    client_id: appConfig.googleClientId,
                    callback: (response) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const res = yield fetch(`${this.serverUrl}/auth/google/token`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    token: response.credential,
                                    appId: this.appId
                                })
                            });
                            const data = yield res.json();
                            if (!res.ok)
                                throw new Error(data.message || "Google login failed");
                            localStorage.setItem(this.tokenStorageKey, data.accessToken);
                            options.onSuccess(data.accessToken);
                        }
                        catch (err) {
                            if (options.onError)
                                options.onError(err);
                        }
                    }),
                    auto_select: options.autoPrompt || false
                });
                window.google.accounts.id.renderButton(container, {
                    theme: "outline",
                    size: "large"
                });
                if (options.autoPrompt) {
                    window.google.accounts.id.prompt();
                }
            }
            catch (err) {
                if (options.onError)
                    options.onError(err);
            }
        });
    }
}
exports.AuthClient = AuthClient;
