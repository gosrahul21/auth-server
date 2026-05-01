# CORS Issues Fixed

## Problems Identified and Resolved

### 1. Cookie Path Issue ❌→✅
**Problem:** Cookie path was set to `/auth/google/token` which made cookies only accessible to that specific endpoint.

**Solution:** Changed to `path: '/'` so cookies work across all routes.

### 2. Duplicate Return Statement ❌→✅
**Problem:** Login endpoint had two return statements causing unreachable code.

**Solution:** Removed duplicate return statement.

### 3. CORS Configuration Incomplete ❌→✅
**Problem:** Basic CORS setup wasn't sufficient for cookie-based authentication.

**Solution:** Enhanced CORS configuration with:
- `methods`: Explicitly allow all HTTP methods including OPTIONS
- `allowedHeaders`: Include all necessary headers for auth
- `exposedHeaders`: Include 'Set-Cookie' so frontend can read cookies
- `credentials: true`: Already present but critical for cookies

### 4. Cookie Security Settings ❌→✅
**Problem:** Fixed values for `secure` and `sameSite` won't work across environments.

**Solution:** Made cookie settings environment-aware:
```typescript
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}
```

## Updated CORS Configuration

```typescript
app.enableCors({
  origin: ['http://localhost:5173', 'https://chat-agent-ui-beryl.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'x-access-token',
    'refresh-token',
  ],
  exposedHeaders: ['Set-Cookie'],
});
```

## Frontend Changes Required

### For Development (localhost:5173)
Your fetch/axios calls must include:

```javascript
// Using fetch
fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // ⭐ CRITICAL for cookies
  body: JSON.stringify({ emailOrUserName, password })
})

// Using axios
axios.post('http://localhost:3000/auth/login', 
  { emailOrUserName, password },
  { 
    withCredentials: true // ⭐ CRITICAL for cookies
  }
)
```

### For Production (Vercel)
When deploying to production:

1. **Update .env in production:**
```env
NODE_ENV=production
```

2. **Ensure frontend domain is in CORS origins** (already done)

3. **Cookies will use:**
   - `secure: true` (requires HTTPS)
   - `sameSite: 'none'` (allows cross-site cookies)

## Testing Checklist

✅ Start server: `npm run start:dev`
✅ Test from frontend with `credentials: 'include'` or `withCredentials: true`
✅ Check browser DevTools > Network > Request Headers for cookies
✅ Check browser DevTools > Application > Cookies to see if cookie is set
✅ Test refresh token endpoint: `GET /auth/refreshSession`

## Common Issues & Solutions

### Issue: Cookie not being set
**Solution:** Make sure `credentials: 'include'` (fetch) or `withCredentials: true` (axios) is set in frontend

### Issue: Cookie set but not sent with requests
**Solution:** Check cookie path is `/` and domain matches

### Issue: CORS error on production
**Solution:** 
- Ensure `NODE_ENV=production` is set
- Ensure your Vercel domain is in the origins array
- Ensure frontend is using HTTPS

### Issue: Cookie not working on Vercel
**Solution:**
- Set `secure: true` in production (already done with environment check)
- Set `sameSite: 'none'` for cross-site cookies (already done)
- Ensure both frontend and backend use HTTPS

## Additional Notes

- **Refresh token** is now stored in httpOnly cookie (more secure)
- **Access token** is still returned in response body (use in Authorization header)
- **Cookie expires** in 7 days
- **Cookie is httpOnly** - JavaScript cannot access it (prevents XSS attacks)

