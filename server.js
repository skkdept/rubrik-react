// Production server for the Railway deployment. Serves the built Vite app
// behind a password gate. The password lives in the SITE_PASSWORD env var
// (Railway "config" / variables tab) — there is no database involved, and
// the check happens here on the server, never in client-side JS.
import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST_DIR = path.join(__dirname, 'dist')

const SITE_PASSWORD = process.env.SITE_PASSWORD
const SESSION_SECRET = process.env.SESSION_SECRET
const COOKIE_NAME = 'site_auth'
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days
const isProduction = process.env.NODE_ENV === 'production'

if (!SITE_PASSWORD) {
  console.error('Missing required env var SITE_PASSWORD.')
  process.exit(1)
}
if (!SESSION_SECRET) {
  console.error('Missing required env var SESSION_SECRET.')
  process.exit(1)
}

function sign(payload) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
}

function issueToken() {
  const payload = String(Date.now() + SESSION_TTL_MS)
  return `${payload}.${sign(payload)}`
}

function isValidToken(token) {
  if (!token) return false
  const separatorIndex = token.lastIndexOf('.')
  if (separatorIndex === -1) return false
  const payload = token.slice(0, separatorIndex)
  const signature = token.slice(separatorIndex + 1)
  const expected = sign(payload)

  const signatureBuf = Buffer.from(signature)
  const expectedBuf = Buffer.from(expected)
  if (signatureBuf.length !== expectedBuf.length) return false
  if (!crypto.timingSafeEqual(signatureBuf, expectedBuf)) return false

  const expiresAt = Number(payload)
  return Number.isFinite(expiresAt) && expiresAt > Date.now()
}

// Constant-time comparison against a fixed-length hash so response timing
// doesn't leak how much of the candidate password was correct.
function isCorrectPassword(candidate) {
  if (typeof candidate !== 'string') return false
  const candidateHash = crypto.createHash('sha256').update(candidate).digest()
  const actualHash = crypto.createHash('sha256').update(SITE_PASSWORD).digest()
  return crypto.timingSafeEqual(candidateHash, actualHash)
}

function parseCookies(header) {
  const cookies = {}
  if (!header) return cookies
  for (const part of header.split(';')) {
    const separatorIndex = part.indexOf('=')
    if (separatorIndex === -1) continue
    const key = decodeURIComponent(part.slice(0, separatorIndex).trim())
    const value = decodeURIComponent(part.slice(separatorIndex + 1).trim())
    cookies[key] = value
  }
  return cookies
}

function loginPage({ error } = {}) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Password required</title>
<style>
  :root { color-scheme: light dark; }
  body {
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #0b0d10; color: #f2f2f2;
  }
  form {
    display: flex; flex-direction: column; gap: 12px;
    width: 280px; padding: 32px;
    background: #16191d; border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  }
  h1 { margin: 0 0 4px; font-size: 18px; }
  input {
    padding: 10px 12px; border-radius: 8px; border: 1px solid #333;
    background: #0b0d10; color: #f2f2f2; font-size: 14px;
  }
  button {
    padding: 10px 12px; border-radius: 8px; border: none;
    background: #f2f2f2; color: #0b0d10; font-weight: 600; cursor: pointer;
  }
  .error { color: #ff6b6b; font-size: 13px; margin: 0; }
</style>
</head>
<body>
  <form method="POST" action="${BASE_PATH}/login">
    <h1>This site is password protected</h1>
    ${error ? `<p class="error">${error}</p>` : ''}
    <input type="password" name="password" placeholder="Password" autofocus required />
    <button type="submit">Enter</button>
  </form>
</body>
</html>`
}

// Served at /rubrik to match vite.config.ts's `base`, which prefixes every
// built asset URL the same way.
const BASE_PATH = '/rubrik'

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => res.redirect(BASE_PATH))

const siteRouter = express.Router()

siteRouter.get('/login', (req, res) => {
  const cookies = parseCookies(req.headers.cookie)
  if (isValidToken(cookies[COOKIE_NAME])) {
    return res.redirect(BASE_PATH)
  }
  res.type('html').send(loginPage())
})

siteRouter.post('/login', (req, res) => {
  if (isCorrectPassword(req.body?.password)) {
    const token = issueToken()
    res.setHeader('Set-Cookie', [
      `${COOKIE_NAME}=${encodeURIComponent(token)}`,
      'HttpOnly',
      `Path=${BASE_PATH}`,
      `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
      'SameSite=Lax',
      ...(isProduction ? ['Secure'] : []),
    ].join('; '))
    return res.redirect(BASE_PATH)
  }
  res.status(401).type('html').send(loginPage({ error: 'Incorrect password.' }))
})

siteRouter.use((req, res, next) => {
  const cookies = parseCookies(req.headers.cookie)
  if (isValidToken(cookies[COOKIE_NAME])) return next()
  res.redirect(`${BASE_PATH}/login`)
})

siteRouter.use(express.static(DIST_DIR))

siteRouter.get('/*splat', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'))
})

app.use(BASE_PATH, siteRouter)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
