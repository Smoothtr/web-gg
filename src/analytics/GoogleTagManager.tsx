import Script from 'next/script'

const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/i

export function normalizeGoogleTagManagerId(value: string | undefined) {
  const id = value?.trim().toUpperCase() ?? ''
  return GTM_ID_PATTERN.test(id) ? id : ''
}

export function GoogleTagManager({ id }: { id: string | undefined }) {
  const safeId = normalizeGoogleTagManagerId(id)
  if (!safeId) return null

  const bootstrap = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${safeId}');`

  return (
    <>
      <Script id="gg99-google-tag-manager" strategy="afterInteractive">
        {bootstrap}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${safeId}`}
          title="Google Tag Manager"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  )
}
