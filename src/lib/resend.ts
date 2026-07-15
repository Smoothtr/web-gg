import 'server-only'

import { Resend } from 'resend'

let resendClient: Resend | null = null

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) return null
  if (!resendClient) resendClient = new Resend(apiKey)
  return resendClient
}
