# @my-org/auth-client

The official frontend JavaScript SDK for integrating your applications with the Auth Server. It provides an extremely simple interface for handling login, signup, and seamless Google OAuth integration without dealing with `fetch` calls or token storage manually.

## Installation

```bash
npm install @my-org/auth-client
```

## Initialization

Import and initialize the `AuthClient` with your specific application ID (`appId`). You can optionally provide the `serverUrl` if you are hosting the Auth Server on a custom domain.

```javascript
import { AuthClient } from '@my-org/auth-client';

const auth = new AuthClient({
  appId: 'YOUR_APPLICATION_ID',
  // serverUrl: 'https://api.your-auth-server.com' // Defaults to http://localhost:3000
});
```

## Standard Email/Password Authentication

### Signup
Creates a new user and automatically logs them in, returning the JWT access token and storing it locally.

```javascript
try {
  const token = await auth.signup({
    userName: 'johndoe',
    email: 'john@example.com',
    password: 'securepassword123',
    firstName: 'John',   // Optional
    lastName: 'Doe'      // Optional
  });
  console.log("Welcome!", token);
} catch (error) {
  console.error("Signup failed:", error.message);
}
```

### Login
Authenticates an existing user and stores the token locally.

```javascript
try {
  const token = await auth.login('john@example.com', 'securepassword123');
  console.log("Logged in successfully!", token);
} catch (error) {
  console.error("Login failed:", error.message);
}
```

## Google OAuth Integration

The SDK can automatically inject the official Google Identity Services library, discover your application's Google Client ID from the Auth Server, render the "Sign In with Google" button, and handle the backend token exchange—all automatically!

All you need is an empty `div` container in your HTML:
```html
<div id="google-login-button"></div>
```

Then, call `renderGoogleButton`:
```javascript
auth.renderGoogleButton('#google-login-button', {
  onSuccess: (token) => {
    console.log("Successfully logged in with Google! Token:", token);
  },
  onError: (error) => {
    console.error("Google authentication failed:", error.message);
  },
  autoPrompt: false // Set to true to show the One-Tap popup
});
```

## Session Management

The SDK automatically manages your JSON Web Token (`accessToken`) inside `localStorage`.

### Get Current Token
Use this method to retrieve the token to attach to the `Authorization` header when making API calls to your own backend.
```javascript
const token = auth.getToken();
if (token) {
  // Make authenticated requests
  fetch('https://api.my-app.com/data', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
```

### Logout
Clears the session token from local storage.
```javascript
auth.logout();
```
