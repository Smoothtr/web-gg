const HOMEPAGE_VIDEO_WIDTHS = [1920, 2560, 3200, 3840] as const
const CLOUDINARY_VIDEO_WIDTH = /\bw_\d+\b/

export function getHomepageVideoDeliveryWidth(viewportWidth: number, devicePixelRatio: number, mobile: boolean) {
  // The approved mobile rendition stays at 1440. Desktop is selected from the
  // rendered width × DPR, so only genuinely large/high-density screens fetch
  // the 4K rendition from a 4K master.
  if (mobile) return 1440
  const requiredWidth = Math.max(1920, Math.ceil(viewportWidth * Math.max(1, devicePixelRatio)))
  return HOMEPAGE_VIDEO_WIDTHS.find((width) => width >= requiredWidth) ?? 3840
}

export function retargetCloudinaryVideoWidth(url: string | undefined, width: number) {
  if (!url || !url.includes('res.cloudinary.com/') || !url.includes('/video/upload/')) return url
  return CLOUDINARY_VIDEO_WIDTH.test(url) ? url.replace(CLOUDINARY_VIDEO_WIDTH, `w_${width}`) : url
}
