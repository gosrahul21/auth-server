const buffer = require('buffer');
buffer.SlowBuffer = buffer.Buffer;
const axios = require('axios');
const jwt = require('jsonwebtoken');

const URL = 'http://localhost:3000';
const rand = Math.floor(Math.random() * 100000);

async function run() {
  try {
    console.log('1. Signing up global admin...');
    await axios.post(`${URL}/auth/signup`, {
      firstName: 'Admin',
      lastName: 'User',
      userName: `admin${rand}`,
      email: `admin${rand}@example.com`,
      password: 'StrongPassword!123'
    });

    console.log('2. Logging in global admin...');
    const loginRes = await axios.post(`${URL}/auth/login`, {
      emailOrUserName: `admin${rand}@example.com`,
      password: 'StrongPassword!123'
    });
    const globalToken = loginRes.data.accessToken;

    console.log('3. Creating App A...');
    const appARes = await axios.post(`${URL}/applications`, { name: 'App A' }, {
      headers: { Authorization: `Bearer ${globalToken}` }
    });
    const appAId = appARes.data.appId;
    const publicKeyA = appARes.data.publicKey;

    console.log('4. Creating App B...');
    const appBRes = await axios.post(`${URL}/applications`, { name: 'App B' }, {
      headers: { Authorization: `Bearer ${globalToken}` }
    });
    const appBId = appBRes.data.appId;
    const publicKeyB = appBRes.data.publicKey;

    console.log('5. Signing up User A in App A...');
    await axios.post(`${URL}/auth/signup`, {
      firstName: 'User',
      lastName: 'A',
      userName: `userA${rand}`,
      email: `usera${rand}@test.com`,
      password: 'StrongPassword!123',
      appId: appAId
    });

    console.log('6. Logging in User A (getting Token A)...');
    const loginARes = await axios.post(`${URL}/auth/login`, {
      emailOrUserName: `usera${rand}@test.com`,
      password: 'StrongPassword!123',
      appId: appAId
    });
    const tokenA = loginARes.data.accessToken;

    console.log('7. Signing up User B in App B...');
    await axios.post(`${URL}/auth/signup`, {
      firstName: 'User',
      lastName: 'B',
      userName: `userB${rand}`,
      email: `userb${rand}@test.com`,
      password: 'StrongPassword!123',
      appId: appBId
    });

    console.log('8. Logging in User B (getting Token B)...');
    const loginBRes = await axios.post(`${URL}/auth/login`, {
      emailOrUserName: `userb${rand}@test.com`,
      password: 'StrongPassword!123',
      appId: appBId
    });
    const tokenB = loginBRes.data.accessToken;

    console.log('\n--- VERIFICATION TESTS ---');
    
    try {
      console.log('Test 1: Verify Token A with Public Key A...');
      jwt.verify(tokenA, publicKeyA, { algorithms: ['RS256'] });
      console.log('✅ Success: Token A verified correctly with App A key.');
    } catch (e) {
      console.error('❌ Failed:', e.message);
    }

    try {
      console.log('Test 2: Verify Token B with Public Key A...');
      jwt.verify(tokenB, publicKeyA, { algorithms: ['RS256'] });
      console.error('❌ Failed: Token B should NOT have verified with App A key!');
    } catch (e) {
      console.log('✅ Success (Expected Failure):', e.message);
    }

    try {
      console.log('Test 3: Verify Token B with Public Key B...');
      jwt.verify(tokenB, publicKeyB, { algorithms: ['RS256'] });
      console.log('✅ Success: Token B verified correctly with App B key.');
    } catch (e) {
      console.error('❌ Failed:', e.message);
    }

    try {
      console.log('Test 4: Verify Token A with Public Key B...');
      jwt.verify(tokenA, publicKeyB, { algorithms: ['RS256'] });
      console.error('❌ Failed: Token A should NOT have verified with App B key!');
    } catch (e) {
      console.log('✅ Success (Expected Failure):', e.message);
    }

  } catch (error) {
    console.error('An error occurred during API requests:');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

run();
