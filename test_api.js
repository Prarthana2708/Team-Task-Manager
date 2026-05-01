fetch('http://localhost:3000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Test', email: 'test_node@test.com', password: 'pwd', role: 'ADMIN' })
}).then(res => res.json()).then(console.log).catch(console.error);
