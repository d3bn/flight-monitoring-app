import { test, expect } from '@playwright/test';

/**
 * PRAG-10: Bootstrap backend service (health endpoint + env loading)
 *
 * Acceptance criteria:
 *  - Backend runs locally and exposes GET /health returning 200 OK
 *  - Response body: { "status": "ok", "timestamp": "<ISO string>" }
 *  - CORS configured to allow the local frontend origin (http://localhost:5173)
 *  - Environment variables loaded from .env (gitignored); .env.example committed
 *  - Swagger/OpenAPI docs accessible at /api/docs
 *
 * Tech stack: NestJS + Fastify adapter, @nestjs/swagger, @nestjs/config
 */

const BACKEND = 'http://localhost:3000';
const FRONTEND_ORIGIN = 'http://localhost:5173';

test.describe('PRAG-10: Bootstrap backend service (health endpoint + env loading)', () => {

  test('GET /health returns HTTP 200', async ({ request }) => {
    const response = await request.get(`${BACKEND}/health`);
    expect(response.status()).toBe(200);
  });

  test('GET /health returns status "ok"', async ({ request }) => {
    const response = await request.get(`${BACKEND}/health`);
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  test('GET /health returns a valid ISO 8601 timestamp', async ({ request }) => {
    const response = await request.get(`${BACKEND}/health`);
    const body = await response.json();
    expect(body.timestamp).toBeDefined();
    // Roundtripping through Date confirms it is a valid ISO string
    expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
  });

  test('GET /health timestamp advances on successive calls', async ({ request }) => {
    const first = await (await request.get(`${BACKEND}/health`)).json();
    const second = await (await request.get(`${BACKEND}/health`)).json();
    expect(new Date(second.timestamp).getTime()).toBeGreaterThanOrEqual(
      new Date(first.timestamp).getTime(),
    );
  });

  test('GET /health response body contains exactly "status" and "timestamp" keys', async ({ request }) => {
    const response = await request.get(`${BACKEND}/health`);
    const body = await response.json();
    expect(Object.keys(body).sort()).toEqual(['status', 'timestamp']);
  });

  test('CORS: GET /health allows the frontend origin via Access-Control-Allow-Origin', async ({ request }) => {
    const response = await request.get(`${BACKEND}/health`, {
      headers: { Origin: FRONTEND_ORIGIN },
    });
    expect(response.status()).toBe(200);
    const acao = response.headers()['access-control-allow-origin'];
    expect(acao).toBe(FRONTEND_ORIGIN);
  });

  test('CORS: OPTIONS preflight for /health returns 204 or 200 with CORS headers', async ({ request }) => {
    const response = await request.fetch(`${BACKEND}/health`, {
      method: 'OPTIONS',
      headers: {
        Origin: FRONTEND_ORIGIN,
        'Access-Control-Request-Method': 'GET',
      },
    });
    expect([200, 204]).toContain(response.status());
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBe(FRONTEND_ORIGIN);
    expect(headers['access-control-allow-methods']).toMatch(/GET/i);
  });

  test('Swagger UI is accessible at /api/docs', async ({ request }) => {
    const response = await request.get(`${BACKEND}/api/docs`);
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] ?? '';
    expect(contentType).toMatch(/text\/html/);
  });

  test('OpenAPI JSON spec is accessible at /api/docs-json', async ({ request }) => {
    const response = await request.get(`${BACKEND}/api/docs-json`);
    expect(response.status()).toBe(200);
    const spec = await response.json();
    expect(spec.openapi ?? spec.swagger).toBeDefined();
    expect(spec.info.title).toBe('Flight Monitoring API');
  });

  test('GET /health is tagged "Health" in the OpenAPI spec', async ({ request }) => {
    const response = await request.get(`${BACKEND}/api/docs-json`);
    const spec = await response.json();
    const healthGet = spec.paths?.['/health']?.get;
    expect(healthGet).toBeDefined();
    expect(healthGet.tags).toContain('Health');
  });
});
