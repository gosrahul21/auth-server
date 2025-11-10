# Testing Google OAuth with Postman

Yes! You can test Google OAuth without setting up a frontend. Here's how:

## Method 1: Using the Token-Based Endpoint (Easiest for Postman)

I've added a new endpoint that accepts Google ID tokens directly, which is perfect for testing with Postman.

### Step 1: Get a Google ID Token

You have two options to get a Google ID token:

#### Option A: Using Google OAuth 2.0 Playground (Recommended)

1. Go to [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click the gear icon (⚙️) in the top right
3. Check "Use your own OAuth credentials"
4. Enter your OAuth Client ID and Client Secret
5. In the left panel, select "Google OAuth2 API v2" → check `https://www.googleapis.com/auth/userinfo.email` and `https://www.googleapis.com/auth/userinfo.profile`
6. Click "Authorize APIs"
7. Sign in with your Google account
8. Click "Exchange authorization code for tokens"
9. Copy the `id_token` from the response (not the access_token)

#### Option B: Using a Quick HTML Page

Create a file `get-google-token.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Get Google Token</title>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body>
    <h1>Get Google ID Token</h1>
    <div id="g_id_onload"
         data-client_id="YOUR_GOOGLE_CLIENT_ID"
         data-callback="handleCredentialResponse">
    </div>
    <div class="g_id_signin" data-type="standard"></div>
    
    <h3>Your Token:</h3>
    <textarea id="token" style="width:100%; height:200px;"></textarea>
    
    <script>
        function handleCredentialResponse(response) {
            document.getElementById('token').value = response.credential;
            console.log("ID Token:", response.credential);
        }
    </script>
</body>
</html>
```

Replace `YOUR_GOOGLE_CLIENT_ID` and open the file in a browser. The token will appear in the textarea.

### Step 2: Test in Postman

Create a new POST request:

**Endpoint:** `http://localhost:3000/auth/google/token`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "token": "YOUR_GOOGLE_ID_TOKEN_HERE"
}
```

**Expected Response:**
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

## Method 2: Testing the Full OAuth Flow (Browser + Postman)

If you want to test the complete OAuth flow:

### Step 1: Start the OAuth Flow in Browser

1. Open your browser and go to:
   ```
   http://localhost:3000/auth/google/login
   ```

2. You'll be redirected to Google's login page
3. Sign in and authorize
4. After authorization, you'll be redirected to the callback URL
5. The response with tokens will be displayed in your browser

### Step 2: Copy the Tokens

The callback will return JSON with `accessToken` and `refreshToken`. Copy these for use in Postman.

### Step 3: Use Tokens in Postman

Now you can test protected endpoints:

**Endpoint:** `http://localhost:3000/auth/` (verify user)

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

## Complete Postman Collection

Here's a complete collection you can import:

```json
{
  "info": {
    "name": "Auth Server - Google OAuth",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Google Token Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"token\": \"YOUR_GOOGLE_ID_TOKEN\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/auth/google/token",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["auth", "google", "token"]
        }
      }
    },
    {
      "name": "Verify User (with Google Token)",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{accessToken}}"
          }
        ],
        "url": {
          "raw": "http://localhost:3000/auth/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["auth"]
        }
      }
    },
    {
      "name": "Regular Email Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"emailOrUserName\": \"user@example.com\",\n  \"password\": \"password123\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/auth/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["auth", "login"]
        }
      }
    }
  ]
}
```

## Quick Testing Steps

1. **Start your server:**
   ```bash
   npm run start:dev
   ```

2. **Get a Google ID token** using OAuth Playground or the HTML page

3. **Open Postman** and create a POST request to:
   ```
   http://localhost:3000/auth/google/token
   ```

4. **Add the body:**
   ```json
   {
     "token": "your-google-id-token-here"
   }
   ```

5. **Send the request** and you'll get back:
   - `accessToken` - Use this for authenticated requests
   - `refreshToken` - Use this to get new access tokens
   - `user` - The user object with Google profile data

6. **Test protected routes** by adding the Authorization header:
   ```
   Authorization: Bearer YOUR_ACCESS_TOKEN
   ```

## Troubleshooting

### "Invalid token audience" error
- Make sure your `GOOGLE_CLIENT_ID` in `.env` matches the Client ID used to generate the token

### "Invalid Google token" error
- The ID token might have expired (they expire after 1 hour)
- Get a fresh token from OAuth Playground

### Token looks too short
- Make sure you copied the `id_token`, not the `access_token`
- ID tokens are typically much longer (JWT format)

## Benefits of the Token-Based Approach

✅ No need for frontend setup
✅ Easy to test in Postman
✅ Perfect for mobile app integration
✅ Can be used by any client that can obtain Google ID tokens
✅ No redirect handling required

The token-based endpoint (`/auth/google/token`) verifies the Google token and returns your app's JWT tokens, making it perfect for API testing and mobile apps!

