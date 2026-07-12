const CLOUDINARY_VIDEO_WIDTH = /\bw_\d+\b/

export function getHomepageVideoDeliveryWidth(viewportWidth: number, _devicePixelRatio: number, mobile: boolean) {
  // Mobile keeps the approved 1440 budget and tablet uses 2560. Desktop always
  // asks for 4K so a future genuine 4K CMS master works without another code
  // change. Cloudinary c_limit still preserves the native source ceiling.
  if (mobile) return 1440
  if (viewportWidth < 1024) return 2560
  return 3840
}

export function retargetCloudinaryVideoWidth(url: string | undefined, width: number) {
  if (!url || !url.includes('res.cloudinary.com/') || !url.includes('/video/upload/')) return url
  return CLOUDINARY_VIDEO_WIDTH.test(url) ? url.replace(CLOUDINARY_VIDEO_WIDTH, `w_${width}`) : url
}
