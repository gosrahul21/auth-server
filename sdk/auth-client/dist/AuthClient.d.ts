export interface AuthClientOptions {
    appId: string;
    serverUrl?: string;
    tokenStorageKey?: string;
}
export interface GoogleButtonOptions {
    onSuccess: (accessToken: string) => void;
    onError?: (error: Error) => void;
    autoPrompt?: boolean;
}
export declare class AuthClient {
    private appId;
    private serverUrl;
    private tokenStorageKey;
    constructor(options: AuthClientOptions);
    /**
     * Retrieves the current access token from localStorage.
     */
    getToken(): string | null;
    /**
     * Clears the session.
     */
    logout(): void;
    /**
     * Login using email and password.
     */
    login(emailOrUserName: string, password: string): Promise<string>;
    /**
     * Signup a new user.
     */
    signup(user: {
        firstName?: string;
        lastName?: string;
        userName: string;
        email: string;
        password: string;
    }): Promise<string>;
    /**
     * Inject Google Script and render the Sign In button.
     */
    renderGoogleButton(containerSelector: string, options: GoogleButtonOptions): void;
    private initializeGoogleClient;
}
