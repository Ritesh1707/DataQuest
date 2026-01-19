const fetch = require('node-fetch'); // Needs install? or use built-in global fetch in node 18+ (Node 22 is active)

async function testRegister() {
  try {
    const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'logtest@test.com', password: '123', name: 'Log Test' })
    });
    console.log('Status:', res.status);
    const txt = await res.text();
    console.log('Body:', txt);
  } catch (e) {
    console.error(e);
  }
}

testRegister();
