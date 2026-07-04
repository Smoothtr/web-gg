export function isUnsupportedPreviewVideoUrl(value?: string) {
  const url = value?.trim()
  if (!url) return false
  return /(^|\/\/|\.)(youtube\.com|youtu\.be)(\/|$)/i.test(url)
}

export function getUnsupportedPreviewVideoMessage(value?: string) {
  return isUnsupportedPreviewVideoUrl(value)
    ? 'YouTube links cannot play in this video preview field. Upload an MP4/WebM/OGG file instead.'
    : ''
}
