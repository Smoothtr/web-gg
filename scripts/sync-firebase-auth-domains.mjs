import { google } from 'googleapis'

const apply = process.argv.includes('--apply')
const requiredEnv = [
  'FIREBASE_ADMIN_PROJECT_ID',
  'FIREBASE_ADMIN_CLIENT_EMAIL',
  'FIREBASE_ADMIN_PRIVATE_KEY',
]
const missingEnv = requiredEnv.filter((key) => !process.env[key])

if (missingEnv.length) {
  throw new Error(`Missing Firebase Admin env: ${missingEnv.join(', ')}`)
}

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
})
const client = await auth.getClient()
const accessToken = await client.getAccessToken()
const token = typeof accessToken === 'string' ? accessToken : accessToken.token

if (!token) throw new Error('Unable to obtain a Google Cloud access token')

const endpoint = `https://identitytoolkit.googleapis.com/admin/v2/projects/${encodeURIComponent(projectId)}/config`

async function identityToolkitRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(`Identity Toolkit request failed (${response.status}): ${body.error?.message ?? 'Unknown error'}`)
  }
  return body
}

const currentConfig = await identityToolkitRequest(endpoint)
const currentDomains = Array.isArray(currentConfig.authorizedDomains)
  ? currentConfig.authorizedDomains.filter((value) => typeof value === 'string')
  : []
const requiredDomains = ['gg99.vn', 'www.gg99.vn', 'theone.marketing', 'www.theone.marketing']
const nextDomains = Array.from(new Set([...currentDomains, ...requiredDomains])).sort()
const missingDomains = requiredDomains.filter((domain) => !currentDomains.includes(domain))

const summary = {
  mode: apply ? 'apply' : 'dry-run',
  currentDomains: [...currentDomains].sort(),
  missingDomains,
  changed: missingDomains.length > 0,
}

if (!apply || missingDomains.length === 0) {
  console.log(JSON.stringify(summary, null, 2))
  if (!apply && missingDomains.length > 0) {
    console.log('Dry run only. Re-run with --apply to add the missing production domains.')
  }
  process.exit(0)
}

await identityToolkitRequest(`${endpoint}?updateMask=authorizedDomains`, {
  method: 'PATCH',
  body: JSON.stringify({ authorizedDomains: nextDomains }),
})

const verifiedConfig = await identityToolkitRequest(endpoint)
const verifiedDomains = Array.isArray(verifiedConfig.authorizedDomains) ? verifiedConfig.authorizedDomains : []
const stillMissing = requiredDomains.filter((domain) => !verifiedDomains.includes(domain))
if (stillMissing.length > 0) throw new Error(`Authorized domain verification failed: ${stillMissing.join(', ')}`)

console.log(JSON.stringify({ ...summary, verifiedDomains: [...verifiedDomains].sort() }, null, 2))
