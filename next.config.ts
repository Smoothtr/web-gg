import type { NextConfig } from 'next'

// CMS-managed image fields should remain on Cloudinary. Keep this explicit;
// adding a new provider requires a reviewed source here rather than a wildcard.
export const trustedCmsImageSources = ['https://res.cloudinary.com'] as const
const trustedSiteImageSources = ['https://flagcdn.com', 'https://api.dicebear.com'] as const

export function buildContentSecurityPolicy(
  productionDeployment = process.env.VERCEL_ENV === 'production',
  analyticsEnabled = /^GTM-[A-Z0-9]+$/i.test(process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? ''),
) {
  const analyticsScriptSource = analyticsEnabled ? ' https://www.googletagmanager.com' : ''
  const analyticsImageSource = analyticsEnabled ? ' https://www.google-analytics.com' : ''
  const analyticsConnectSources = analyticsEnabled ? ' https://www.google-analytics.com https://region1.google-analytics.com' : ''
  const analyticsFrameSource = analyticsEnabled ? ' https://www.googletagmanager.com' : ''
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `script-src 'self' 'unsafe-inline' https://www.gstatic.com https://apis.google.com https://challenges.cloudflare.com${analyticsScriptSource}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    `img-src 'self' data: blob: ${[...trustedCmsImageSources, ...trustedSiteImageSources].join(' ')}${analyticsImageSource}`,
    "media-src 'self' blob: https://res.cloudinary.com",
    `connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://api.cloudinary.com https://challenges.cloudflare.com${analyticsConnectSources}`,
    `frame-src 'self' https://accounts.google.com https://*.firebaseapp.com https://challenges.cloudflare.com${analyticsFrameSource}`,
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    ...(productionDeployment ? ['upgrade-insecure-requests'] : []),
  ].join('; ')
}

const contentSecurityPolicy = buildContentSecurityPolicy()

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY:
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? process.env.VITE_FIREBASE_API_KEY ?? '',
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? process.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.VITE_FIREBASE_PROJECT_ID ?? '',
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? process.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? process.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    NEXT_PUBLIC_FIREBASE_APP_ID:
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? process.env.VITE_FIREBASE_APP_ID ?? '',
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: securityHeaders,
    },
  ],
  redirects: async () => [
    {
      source: '/campaign/the-one',
      destination: '/',
      permanent: true,
    },
    {
      source: '/en/campaign/the-one',
      destination: '/',
      permanent: true,
    },
    {
      source: '/en',
      destination: '/',
      permanent: true,
    },
    {
      source: '/vi',
      destination: '/',
      permanent: true,
    },
    {
      source: '/ko',
      destination: '/',
      permanent: true,
    },
    {
      source: '/packages',
      destination: '/#packages',
      permanent: true,
    },
    {
      source: '/en/packages',
      destination: '/#packages',
      permanent: true,
    },
    {
      source: '/vi/packages',
      destination: '/#packages',
      permanent: true,
    },
    {
      source: '/ko/packages',
      destination: '/#packages',
      permanent: true,
    },
    {
      source: '/en/:path*',
      destination: '/:path*',
      permanent: true,
    },
    {
      source: '/vi/:path*',
      destination: '/:path*',
      permanent: true,
    },
    {
      source: '/ko/:path*',
      destination: '/:path*',
      permanent: true,
    },
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'gg99.vn' }],
      destination: 'https://www.gg99.vn/:path*',
      permanent: true,
    },
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'www.theone.marketing' }],
      destination: 'https://theone.marketing/:path*',
      permanent: true,
    },
  ],
}

export default nextConfig
