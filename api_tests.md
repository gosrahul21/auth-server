# API Test Results
Here is the series of tests run against the server, along with their payloads and actual responses.

## 1. Global Signup
```json
POST /auth/signup
{
  "firstName": "Admin",
  "lastName": "User",
  "userName": "adminuser30364",
  "email": "admin30364@example.com",
  "password": "StrongPassword!123"
}
```
**Response:**
```json
{
  "userName": "adminuser30364",
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin30364@example.com",
  "roles": [],
  "appId": null,
  "googleId": null,
  "picture": null,
  "id": "f1fe9d98-0235-41b8-86dc-fbdaab189d69",
  "status": "pending",
  "createDate": "2026-07-17T08:20:36.207Z"
}
```

## 2. Global Login
```json
POST /auth/login
{
  "emailOrUserName": "admin30364@example.com",
  "password": "StrongPassword!123"
}
```
**Response:**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmMWZlOWQ5OC0wMjM1LTQxYjgtODZkYy1mYmRhYWIxODlkNjkiLCJlbWFpbCI6ImFkbWluMzAzNjRAZXhhbXBsZS5jb20iLCJ1c2VyTmFtZSI6ImFkbWludXNlcjMwMzY0Iiwicm9sZSI6W10sImZpcnN0TmFtZSI6IkFkbWluIiwibGFzdE5hbWUiOiJVc2VyIiwicGljdHVyZSI6bnVsbCwiaWF0IjoxNzg0Mjk2MjM3LCJleHAiOjE3ODQyOTgwMzd9.qghxecqN9XDckgN90NTiaoGPV4J26t5LUVv9ZKY2BE2BORlCd5RMyiC-YqNkhszBt-VNH5I_dTEKxFvY7xfJUhHXlnP6a5rSRwFveYQOl8Dnd03sQ_8Q2JlFOKvBFhcrRTxnPMU7s04vTC6iPrUMLjh1gxoDFrco1l1FWCijPLw",
  "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmMWZlOWQ5OC0wMjM1LTQxYjgtODZkYy1mYmRhYWIxODlkNjkiLCJlbWFpbCI6ImFkbWluMzAzNjRAZXhhbXBsZS5jb20iLCJ1c2VyTmFtZSI6ImFkbWludXNlcjMwMzY0Iiwicm9sZSI6W10sImZpcnN0TmFtZSI6IkFkbWluIiwibGFzdE5hbWUiOiJVc2VyIiwicGljdHVyZSI6bnVsbCwiaWF0IjoxNzg0Mjk2MjM3LCJleHAiOjE3ODQzMTc4Mzd9.eDW_DQ-kj0x1ffOqiI5ybPmQP8G8QiICfonV85mwQBTTw5bnS89HXWtVR9GZQsFaN5px1cxRlyggMqYeOz6pgjhKBw32tmhs0OWz0lqr7qN0t_9f5WgNf_xqrvLrl9BlGcy-rchWRBGoOOAxLU3bca-hU4Q6LyB2Y4olfkEQiS8"
}
```

## 3. Create Application
```json
POST /applications
{
  "name": "My Test App"
}
```
**Response:**
```json
{
  "name": "My Test App",
  "appId": "59930b47-4960-4bf3-99a9-df6278204b16",
  "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0iKeQn2zGmTxXIDOS6CM\nESg0OQOqin7SpecUIfl/K/yLnUcbEKr1RPmA5jrcYJJbv/iOSdEe/PDcy0UEx6j3\nM2Qp5hLIOHAVuNrhIS53GJ+xgoh/ajeZsjQEGTqF6VwsVJVlZBXrH9v6SbE2jOhW\n0Tz/gVaNj3PR/yRr7T8TcEAGH0fLxuUHhV01KMvhhMWoCJxVWrYSk2xCxNXbOeCy\nJy2lNjeToWIQulH6JoA9KPL2cZUpYWny+gnWH7uotz/0qYbps2BBo7vDakk4jSuU\nYseQtALsb8VjGzkJ9574MfyARFfB3/oen5Qcci3Dw4c0zIOVVy4TLetaqqeRGfOQ\nyQIDAQAB\n-----END PUBLIC KEY-----\n",
  "allowedOrigins": [],
  "userId": "f1fe9d98-0235-41b8-86dc-fbdaab189d69",
  "googleClientId": null,
  "googleClientSecret": null,
  "id": "fc1558a1-ee7e-4138-a75d-f26200352fd2",
  "createDate": "2026-07-17T08:20:38.247Z",
  "updateDate": "2026-07-17T08:20:38.247Z"
}
```

## 4. Get Public JWKS
```json
GET /applications/59930b47-4960-4bf3-99a9-df6278204b16/.well-known/jwks.json
```
**Response:**
```json
{
  "keys": [
    {
      "kty": "RSA",
      "n": "0iKeQn2zGmTxXIDOS6CMESg0OQOqin7SpecUIfl_K_yLnUcbEKr1RPmA5jrcYJJbv_iOSdEe_PDcy0UEx6j3M2Qp5hLIOHAVuNrhIS53GJ-xgoh_ajeZsjQEGTqF6VwsVJVlZBXrH9v6SbE2jOhW0Tz_gVaNj3PR_yRr7T8TcEAGH0fLxuUHhV01KMvhhMWoCJxVWrYSk2xCxNXbOeCyJy2lNjeToWIQulH6JoA9KPL2cZUpYWny-gnWH7uotz_0qYbps2BBo7vDakk4jSuUYseQtALsb8VjGzkJ9574MfyARFfB3_oen5Qcci3Dw4c0zIOVVy4TLetaqqeRGfOQyQ",
      "e": "AQAB",
      "alg": "RS256",
      "use": "sig",
      "kid": "59930b47-4960-4bf3-99a9-df6278204b16-key-1"
    }
  ]
}
```

## 5. App-Specific Signup
```json
POST /auth/signup
{
  "firstName": "App",
  "lastName": "User",
  "userName": "appuser30364",
  "email": "user30364@testapp.com",
  "password": "StrongPassword!123",
  "appId": "59930b47-4960-4bf3-99a9-df6278204b16"
}
```
**Response:**
```json
{
  "appId": "59930b47-4960-4bf3-99a9-df6278204b16",
  "userName": "appuser30364",
  "firstName": "App",
  "lastName": "User",
  "email": "user30364@testapp.com",
  "roles": [],
  "googleId": null,
  "picture": null,
  "id": "0fd7723a-a6a1-414d-a237-9d9a1de3861e",
  "status": "pending",
  "createDate": "2026-07-17T08:20:41.209Z"
}
```

## 6. App-Specific Login
```json
POST /auth/login
{
  "emailOrUserName": "user30364@testapp.com",
  "password": "StrongPassword!123",
  "appId": "59930b47-4960-4bf3-99a9-df6278204b16"
}
```
**Response:**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwZmQ3NzIzYS1hNmExLTQxNGQtYTIzNy05ZDlhMWRlMzg2MWUiLCJlbWFpbCI6InVzZXIzMDM2NEB0ZXN0YXBwLmNvbSIsInVzZXJOYW1lIjoiYXBwdXNlcjMwMzY0Iiwicm9sZSI6W10sImZpcnN0TmFtZSI6IkFwcCIsImxhc3ROYW1lIjoiVXNlciIsInBpY3R1cmUiOm51bGwsImlhdCI6MTc4NDI5NjI0MiwiZXhwIjoxNzg0Mjk4MDQyfQ.lW9amvGWP8vedQgJ5NHUfJJexVG_FJlv1p5lwitGTo2dfBKEmrZ0WEdiEPVooQNmC9uoGs8H6Jo5hLfjsYiQSJAXO7lwwrMbG8AkORy5Y7IadWAP0AvdX-Hc1oJxvlsyJvipQbpjHZBfydNhDsMUlo2hY_SpBkK_B27kkhF9RnQ",
  "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwZmQ3NzIzYS1hNmExLTQxNGQtYTIzNy05ZDlhMWRlMzg2MWUiLCJlbWFpbCI6InVzZXIzMDM2NEB0ZXN0YXBwLmNvbSIsInVzZXJOYW1lIjoiYXBwdXNlcjMwMzY0Iiwicm9sZSI6W10sImZpcnN0TmFtZSI6IkFwcCIsImxhc3ROYW1lIjoiVXNlciIsInBpY3R1cmUiOm51bGwsImlhdCI6MTc4NDI5NjI0MiwiZXhwIjoxNzg0MzE3ODQyfQ.mrLUiIY-0zYC_CygIZ2eby9iRCxo6mo5_ojABvAJpbpxU7C3Mq02-f77mdzmTWuVM73_i9tFfo26PGybBwKv6kz-hHoOtDMyzOtI1_x2EDlPsE3TQCJNiAc2dsspwVTZGZm9BURmmrT6Y-_DsbBF7QQWe61aaKM6wew44wZwTtw"
}
```
```

## 7. Cross-App JWT Signature Validation (Node.js Script)
We executed a Node.js script to create two applications (App A and App B), generated tokens for users in both, and cryptographically verified the isolation using the public keys.

**Test Results (stdout):**
```text
1. Signing up global admin...
2. Logging in global admin...
3. Creating App A...
4. Creating App B...
5. Signing up User A in App A...
6. Logging in User A (getting Token A)...
7. Signing up User B in App B...
8. Logging in User B (getting Token B)...

--- VERIFICATION TESTS ---
Test 1: Verify Token A with Public Key A...
✅ Success: Token A verified correctly with App A key.
Test 2: Verify Token B with Public Key A...
✅ Success (Expected Failure): invalid signature
Test 3: Verify Token B with Public Key B...
✅ Success: Token B verified correctly with App B key.
Test 4: Verify Token A with Public Key B...
✅ Success (Expected Failure): invalid signature
```
