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

export class AuthClient {
  private appId: string;
  private serverUrl: string;
  private tokenStorageKey: string;

  constructor(options: AuthClientOptions) {
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
  public getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  /**
   * Clears the session.
   */
  public logout(): void {
    localStorage.removeItem(this.tokenStorageKey);
  }

  /**
   * Login using email and password.
   */
  public async login(emailOrUserName: string, password: string): Promise<string> {
    const response = await fetch(`${this.serverUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUserName, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem(this.tokenStorageKey, data.accessToken);
    return data.accessToken;
  }

  /**
   * Signup a new user.
   */
  public async signup(user: { firstName?: string, lastName?: string, userName: string, email: string, password: string }): Promise<string> {
    const response = await fetch(`${this.serverUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, appId: this.appId })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    localStorage.setItem(this.tokenStorageKey, data.accessToken);
    return data.accessToken;
  }

  /**
   * Inject Google Script and render the Sign In button.
   */
  public renderGoogleButton(containerSelector: string, options: GoogleButtonOptions): void {
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
    } else {
      // If already loaded
      if ((window as any).google && (window as any).google.accounts) {
        this.initializeGoogleClient(container, options);
      } else {
        // Wait for it to load
        setTimeout(() => this.renderGoogleButton(containerSelector, options), 100);
      }
    }
  }

  private async initializeGoogleClient(container: Element, options: GoogleButtonOptions) {
    try {
      const appResponse = await fetch(`${this.serverUrl}/applications/${this.appId}/public-config`);
      if (!appResponse.ok) {
        throw new Error("Failed to load application public config");
      }
      const appConfig = await appResponse.json();

      if (!appConfig.googleClientId) {
        throw new Error("Google Client ID is not configured for this application");
      }

      (window as any).google.accounts.id.initialize({
        client_id: appConfig.googleClientId,
        callback: async (response: any) => {
          try {
            const res = await fetch(`${this.serverUrl}/auth/google/token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                token: response.credential,
                appId: this.appId
              })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Google login failed");

            localStorage.setItem(this.tokenStorageKey, data.accessToken);
            options.onSuccess(data.accessToken);
          } catch (err) {
            if (options.onError) options.onError(err as Error);
          }
        },
        auto_select: options.autoPrompt || false
      });

      (window as any).google.accounts.id.renderButton(container, {
        theme: "outline",
        size: "large"
      });

      if (options.autoPrompt) {
        (window as any).google.accounts.id.prompt();
      }
    } catch(err) {
      if(options.onError) options.onError(err as Error);
    }
  }
}
