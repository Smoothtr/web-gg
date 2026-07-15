export class NotificationProviderError extends Error {
  readonly code: string

  constructor(code: string) {
    super(code)
    this.name = 'NotificationProviderError'
    this.code = code
  }
}

export function notificationErrorCode(error: unknown) {
  if (error instanceof NotificationProviderError) return error.code
  return 'notification_unexpected_error'
}
