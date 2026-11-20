const http = require('node:http');

const startedAt = Date.now();
let requestCount = 0;

function handler(req, res) {
  requestCount += 1;
  const url = req.url.split('?')[0];

  const send = (status, body, type = 'application/json') => {
    res.writeHead(status, { 'Content-Type': type });
    res.end(type === 'application/json' ? JSON.stringify(body) : body);
  };

  if (req.method === 'GET' && url === '/') {
    return send(200, {
      service: 'sample-api',
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.APP_ENV || 'local',
    });
  }

  if (req.method === 'GET' && url === '/health') {
    return send(200, { status: 'ok' });
  }

  // Format texte Prometheus, lu par le monitoring (phase 4)
  if (req.method === 'GET' && url === '/metrics') {
    const uptime = ((Date.now() - startedAt) / 1000).toFixed(0);
    const body = [
      '# HELP http_requests_total Nombre total de requêtes reçues',
      '# TYPE http_requests_total counter',
      `http_requests_total ${requestCount}`,
      '# HELP process_uptime_seconds Durée de fonctionnement du processus',
      '# TYPE process_uptime_seconds gauge',
      `process_uptime_seconds ${uptime}`,
      '',
    ].join('\n');
    return send(200, body, 'text/plain; version=0.0.4');
  }

  return send(404, { error: 'not found' });
}

function createServer() {
  return http.createServer(handler);
}

module.exports = { createServer };
