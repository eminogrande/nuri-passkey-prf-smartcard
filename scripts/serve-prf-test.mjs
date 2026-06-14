#!/usr/bin/env node
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import process from 'node:process';

const root = resolve(new URL('..', import.meta.url).pathname);
const webRoot = join(root, 'web');
const port = Number.parseInt(process.env.PORT || '8765', 10);
const host = process.env.HOST || '127.0.0.1';

const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
]);

function json(res, status, data) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 32 * 1024) {
        reject(new Error('request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) return resolveBody({});
      try {
        resolveBody(JSON.parse(body));
      } catch {
        reject(new Error('invalid json'));
      }
    });
    req.on('error', reject);
  });
}

function parseJsonObjects(stdout) {
  const text = String(stdout || '').trim();
  const objects = [];
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === '{') {
      if (depth === 0) start = i;
      depth += 1;
      continue;
    }
    if (char === '}') {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        objects.push(JSON.parse(text.slice(start, i + 1)));
        start = -1;
      }
    }
  }
  return objects;
}

function parseJsonOutput(stdout) {
  const objects = parseJsonObjects(stdout);
  if (objects.length === 0) return null;
  return objects.at(-1);
}

function runCardCommand(args, timeoutMs = 180000) {
  return new Promise((resolveRun) => {
    const child = spawn(join(root, 'scripts/card-prf-backup.sh'), args, {
      cwd: root,
      env: {
        ...process.env,
        PYTHONUNBUFFERED: '1',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
    }, timeoutMs);
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString('utf8');
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf8');
    });
    child.on('close', (code, signal) => {
      clearTimeout(timer);
      let parsed = null;
      try {
        parsed = parseJsonOutput(stdout);
      } catch {}
      resolveRun({
        ok: code === 0,
        code,
        signal,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        result: parsed,
      });
    });
  });
}

function addBaseArgs(args, body = {}) {
  const profile = String(body.profile || 'browser-bridge').trim();
  const userVerification = String(body.userVerification || '').trim();
  const salt = String(body.salt || '').trim();
  const secondSalt = String(body.secondSalt || '').trim();

  if (profile) args.push('--profile', profile);
  if (userVerification) args.push('--user-verification', userVerification);
  if (salt) args.push('--salt', salt);
  if (secondSalt) args.push('--second-salt', secondSalt);
  return args;
}

function addSelftestArgs(args, body = {}) {
  const residentKey = String(body.residentKey || '').trim();
  const registrationPrfRaw = String(body.registrationPrf || '').trim();
  const registrationPrf = registrationPrfRaw === 'enabled' ? 'prf' : registrationPrfRaw;
  addBaseArgs(args, body);
  if (residentKey) args.push('--resident-key', residentKey);
  if (registrationPrf) args.push('--registration-prf', registrationPrf);
  return args;
}

function addDeriveArgs(args, body = {}) {
  return addBaseArgs(args, body);
}

async function handleApi(req, res) {
  if (req.method === 'GET' && req.url === '/api/pcsc/info') {
    const run = await runCardCommand(['info']);
    return json(res, run.ok ? 200 : 500, {
      mode: 'pcsc-local-bridge',
      command: 'info',
      ...run,
    });
  }

  if (req.method === 'POST' && req.url === '/api/pcsc/selftest') {
    const body = await readBody(req);
    const args = addSelftestArgs(['selftest'], { ...body, secondSalt: '' });
    const run = await runCardCommand(args);
    return json(res, run.ok ? 200 : 500, {
      mode: 'pcsc-local-bridge',
      command: 'selftest',
      args,
      ...run,
    });
  }

  if (req.method === 'POST' && req.url === '/api/pcsc/derive') {
    const body = await readBody(req);
    const args = addDeriveArgs(['derive'], body);
    const run = await runCardCommand(args);
    return json(res, run.ok ? 200 : 500, {
      mode: 'pcsc-local-bridge',
      command: 'derive',
      args,
      ...run,
    });
  }

  return json(res, 404, { error: 'not found' });
}

async function handleStatic(req, res) {
  const requestUrl = new URL(req.url || '/', `http://${host}:${port}`);
  const pathname = requestUrl.pathname === '/' ? '/prf-test.html' : requestUrl.pathname;
  const candidate = normalize(join(webRoot, pathname));
  if (!candidate.startsWith(webRoot)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const body = await readFile(candidate);
    res.writeHead(200, {
      'content-type': mimeTypes.get(extname(candidate)) || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}

const server = createServer(async (req, res) => {
  try {
    if ((req.url || '').startsWith('/api/')) return await handleApi(req, res);
    return await handleStatic(req, res);
  } catch (error) {
    return json(res, 500, {
      error: error?.message || String(error),
    });
  }
});

server.listen(port, host, () => {
  console.log(`Serving WebAuthn PRF test page at http://${host}:${port}/prf-test.html`);
  console.log(`Local PC/SC bridge enabled at http://${host}:${port}/api/pcsc/info`);
});
