const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../src/app');

let server;
let base;

before(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test('GET / renvoie le nom du service', async () => {
  const res = await fetch(`${base}/`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.service, 'sample-api');
});

test('GET /health renvoie ok', async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'ok' });
});

test('GET /metrics expose les métriques au format Prometheus', async () => {
  const res = await fetch(`${base}/metrics`);
  assert.equal(res.status, 200);
  const text = await res.text();
  assert.match(text, /http_requests_total \d+/);
  assert.match(text, /process_uptime_seconds \d+/);
});

test('une route inconnue renvoie 404', async () => {
  const res = await fetch(`${base}/inconnu`);
  assert.equal(res.status, 404);
});
