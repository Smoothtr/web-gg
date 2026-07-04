export function openBookingModal(source?: unknown) {
  window.dispatchEvent(new CustomEvent('gg99:open-booking', { detail: { source: typeof source === 'string' ? source : undefined } }))
}
