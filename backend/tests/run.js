process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_jwt';

const request = require('supertest');
const assert = require('assert');
const app = require('../server');

async function runTests() {
  console.log('Starting Backend API & Security Tests...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}`);
      console.error(err);
      failed++;
    }
  }

  // 1. Test server root endpoint
  await test('GET / - Server Status Check', async () => {
    const res = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    assert.strictEqual(res.body.message, 'SecureVote API is running...');
  });

  // 2. Test Input Validation for registration
  await test('POST /api/auth/register - Input Validation Check (missing fields)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'voter@college.edu' }) // missing name and password
      .expect('Content-Type', /json/)
      .expect(400);

    assert.ok(res.body.error);
    assert.strictEqual(res.body.error, 'Please provide name, email, and password');
  });

  // 3. Test Security Headers (Helmet Check)
  await test('GET / - Security Headers Verification', async () => {
    const res = await request(app)
      .get('/')
      .expect(200);

    // Verify helmet protection headers are active
    assert.ok(res.headers['x-content-type-options']);
    assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
    assert.ok(res.headers['x-frame-options']);
    assert.ok(res.headers['x-xss-protection'] || res.headers['content-security-policy']);
  });

  // 4. Test API skeleton fallback route check
  await test('GET /api/voting - Unimplemented Milestone 6 Routes Check', async () => {
    await request(app)
      .get('/api/voting')
      .expect(501);
  });

  console.log(`\nTest Summary: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
