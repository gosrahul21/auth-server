# Google OAuth Setup Guide

This guide will help you set up Google OAuth login/signup for your NestJS authentication server.

## Prerequisites

1. Install the required dependencies:

```bash
npm install @nestjs/passport passport passport-google-oauth20 @types/passport-google-oauth20
```

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application** as the application type
6. Add your authorized redirect URIs:
   - For development: `http://localhost:3000/auth/google/callback`
   - For production: `https://yourdomain.com/auth/google/callback`
7. Click **Create** and copy your **Client ID** and **Client Secret**

## Step 2: Configure Environment Variables

Add the following variables to your `.env` file:

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

## Step 3: API Endpoints

The following endpoints have been added to your authentication server:

### Initiate Google OAuth Login
```
GET /auth/google/login
```
This endpoint redirects users to Google's OAuth consent screen.

### Google OAuth Callback
```
GET /auth/google/callback
```
This endpoint handles the callback from Google and returns the user data with JWT tokens.

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "userName": "user",
    "picture": "https://lh3.googleusercontent.com/...",
    "roles": []
  }
}
```

## Step 4: Frontend Integration

### Using Plain JavaScript

```javascript
// Redirect user to Google OAuth
function loginWithGoogle() {
  window.location.href = 'http://localhost:3000/auth/google/login';
}

// Handle the callback (you'll need to extract tokens from the response)
// Option 1: Redirect to a frontend route that handles the token
// Option 2: Use a popup window and communicate via postMessage
```

### Using React

```jsx
import React from 'react';

function LoginPage() {
  const handleGoogleLogin = () => {
    // Open Google OAuth in a popup
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const popup = window.open(
      'http://localhost:3000/auth/google/login',
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for the callback
    window.addEventListener('message', (event) => {
      if (event.origin === 'http://localhost:3000') {
        const { accessToken, refreshToken, user } = event.data;
        // Store tokens and redirect
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        // Close popup and redirect
        popup.close();
        window.location.href = '/dashboard';
      }
    });
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}

export default LoginPage;
```

## How It Works

1. **User Registration/Login**: When a user logs in with Google:
   - If the user doesn't exist, a new account is created automatically
   - If the user exists (matched by email), their Google ID is linked to their account
   - If the user exists with the same Google ID, they are logged in

2. **User Data**: The following fields are stored/updated:
   - `googleId`: Google's unique user identifier
   - `email`: User's email from Google
   - `firstName`: User's first name from Google
   - `lastName`: User's last name from Google
   - `userName`: Generated from email (part before @)
   - `picture`: User's profile picture URL from Google

3. **Password**: Users who sign up with Google don't need a password. The `password` field is now optional in the User entity.

## Security Notes

- Store your Google Client Secret securely and never commit it to version control
- Use HTTPS in production
- Validate and sanitize all user data
- Consider implementing rate limiting on OAuth endpoints
- Add proper CORS configuration for your frontend domain

## Testing

You can test the Google OAuth flow using these steps:

1. Start your server:
```bash
npm run start:dev
```

2. Open your browser and navigate to:
```
http://localhost:3000/auth/google/login
```

3. You should be redirected to Google's consent screen
4. After authorizing, you'll be redirected back with the user data and tokens

## Troubleshooting

### "Redirect URI mismatch" error
- Ensure your redirect URI in Google Cloud Console exactly matches your `GOOGLE_CALLBACK_URL`
- Check for trailing slashes and http vs https

### "Invalid client" error
- Verify your Client ID and Client Secret are correct
- Ensure your Google Cloud project has the OAuth consent screen configured

### User not being created
- Check your MongoDB connection
- Verify the User model has all required fields as optional or with defaults

