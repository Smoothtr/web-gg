# GG99 Firebase CMS Setup

## Phase 1 keys for `/admin`

Create a Firebase project, then open Project settings > General > Your apps > Web app.

Add these values to `.env.local`:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_EMAILS=you@gg99.vn,team@gg99.vn
```

These are Firebase Web SDK config values. They are public client config, not private service account secrets.

## Firebase Console setup

1. Enable Authentication.
2. Enable Google sign-in provider.
3. Enable Firestore Database.
4. Publish `firestore.rules`, replacing `admin@gg99.vn` with the same admin emails from `VITE_ADMIN_EMAILS`.
5. Restart the local dev server and open `/admin`.
6. Sign in with Google.
7. Click `Seed current content` once to push current pages and insights into Firestore.

## Collections

The admin uses:

- `sitePages`: homepage, the-one, packages, about, services, contact.
- `insights`: insight article documents by slug.

## Next.js server-side rendering

The public site now renders through Next.js App Router. Metadata, sitemap, schema, and page/article HTML are generated server-side from Firestore with a 5-minute ISR window.

For local and Vercel builds, add server-only env values:

```bash
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
REVALIDATE_SECRET=
```

Never expose these `FIREBASE_ADMIN_*` values to client-side code.

Seed Firestore once when the `sitePages` and `insights` collections are empty:

```bash
npm run seed:cms
```

The seed script writes:

- `sitePages`: homepage, the-one, packages, about, services, contact.
- `insights`: current insight article documents by slug.

Manual cache revalidation is available at:

```txt
POST /api/revalidate
Header: x-revalidate-secret: <REVALIDATE_SECRET>
Body: { "path": "/insights/the-one-packages" }
```
