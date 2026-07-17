#!/bin/bash
URL="http://localhost:3000"
FILE="api_tests.md"

echo "# API Test Results" > $FILE
echo "Here is the series of tests run against the server, along with their payloads and actual responses." >> $FILE
echo "" >> $FILE

RAND=$RANDOM
echo "## 1. Global Signup" >> $FILE
echo '```json' >> $FILE
PAYLOAD='{"firstName":"Admin","lastName":"User","userName":"adminuser'$RAND'","email":"admin'$RAND'@example.com","password":"StrongPassword!123"}'
echo "POST /auth/signup" >> $FILE
echo "$PAYLOAD" | jq . >> $FILE
echo '```' >> $FILE
echo "**Response:**" >> $FILE
echo '```json' >> $FILE
curl -s -X POST $URL/auth/signup -H "Content-Type: application/json" -d "$PAYLOAD" | jq . >> $FILE
echo '```' >> $FILE
echo "" >> $FILE

echo "## 2. Global Login" >> $FILE
echo '```json' >> $FILE
PAYLOAD='{"emailOrUserName":"admin'$RAND'@example.com","password":"StrongPassword!123"}'
echo "POST /auth/login" >> $FILE
echo "$PAYLOAD" | jq . >> $FILE
echo '```' >> $FILE
echo "**Response:**" >> $FILE
echo '```json' >> $FILE
LOGIN_RESP=$(curl -s -X POST $URL/auth/login -H "Content-Type: application/json" -d "$PAYLOAD")
echo "$LOGIN_RESP" | jq . >> $FILE
echo '```' >> $FILE
echo "" >> $FILE

TOKEN=$(echo $LOGIN_RESP | jq -r .accessToken)

echo "## 3. Create Application" >> $FILE
echo '```json' >> $FILE
PAYLOAD='{"name":"My Test App"}'
echo "POST /applications" >> $FILE
echo "$PAYLOAD" | jq . >> $FILE
echo '```' >> $FILE
echo "**Response:**" >> $FILE
echo '```json' >> $FILE
APP_RESP=$(curl -s -X POST $URL/applications -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "$PAYLOAD")
echo "$APP_RESP" | jq . >> $FILE
echo '```' >> $FILE
echo "" >> $FILE

APP_ID=$(echo $APP_RESP | jq -r .appId)

if [ "$APP_ID" != "null" ]; then
echo "## 4. Get Public JWKS" >> $FILE
echo '```json' >> $FILE
echo "GET /applications/$APP_ID/.well-known/jwks.json" >> $FILE
echo '```' >> $FILE
echo "**Response:**" >> $FILE
echo '```json' >> $FILE
curl -s -X GET $URL/applications/$APP_ID/.well-known/jwks.json | jq . >> $FILE
echo '```' >> $FILE
echo "" >> $FILE



echo "## 5. App-Specific Signup" >> $FILE
echo '```json' >> $FILE
PAYLOAD='{"firstName":"App","lastName":"User","userName":"appuser'$RAND'","email":"user'$RAND'@testapp.com","password":"StrongPassword!123","appId":"'$APP_ID'"}'
echo "POST /auth/signup" >> $FILE
echo "$PAYLOAD" | jq . >> $FILE
echo '```' >> $FILE
echo "**Response:**" >> $FILE
echo '```json' >> $FILE
curl -s -X POST $URL/auth/signup -H "Content-Type: application/json" -d "$PAYLOAD" | jq . >> $FILE
echo '```' >> $FILE
echo "" >> $FILE

echo "## 6. App-Specific Login" >> $FILE
echo '```json' >> $FILE
PAYLOAD='{"emailOrUserName":"user'$RAND'@testapp.com","password":"StrongPassword!123","appId":"'$APP_ID'"}'
echo "POST /auth/login" >> $FILE
echo "$PAYLOAD" | jq . >> $FILE
echo '```' >> $FILE
echo "**Response:**" >> $FILE
echo '```json' >> $FILE
curl -s -X POST $URL/auth/login -H "Content-Type: application/json" -d "$PAYLOAD" | jq . >> $FILE
echo '```' >> $FILE
echo "" >> $FILE
fi

cat $FILE
