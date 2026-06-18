const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  const email = `test_${Date.now()}@test.com`;
  const password = 'password123';

  // Register
  await request({
    hostname: '127.0.0.1', port: 3000, path: '/users', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { name: 'Test User', email, password });
  
  // Login
  const loginRes = await request({
    hostname: '127.0.0.1', port: 3000, path: '/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email, password });
  const token = JSON.parse(loginRes.body).access_token;

  const title105 = 'A'.repeat(105);
  const title300 = 'B'.repeat(300);

  const testPayloads = [
    {
      name: 'Payload with 105 chars title',
      payload: { title: title105, description: '', isCompleted: false, dueDate: null, category: 'Outros' }
    },
    {
      name: 'Payload with 300 chars title',
      payload: { title: title300, description: '', isCompleted: false, dueDate: null, category: 'Outros' }
    }
  ];

  for (const t of testPayloads) {
    const res = await request({
      hostname: '127.0.0.1', port: 3000, path: '/tasks', method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }, t.payload);
    console.log(`${t.name} -> Status: ${res.statusCode}, Body: ${res.body}`);
  }
}

run().catch(console.error);
