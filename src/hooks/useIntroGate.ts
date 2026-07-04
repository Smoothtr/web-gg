/**
 * Phối hợp với intro loader mà KHÔNG chỉnh sửa nó.
 * `whenIntroGone(cb)` gọi cb ngay khi overlay `.intro-loader` biến mất khỏi DOM
 * (hoặc ngay lập tức nếu intro đã xong / không có / user bật reduced-motion).
 *
 * Nhờ vậy các animation của hero (đang nằm dưới intro) chỉ chạy khi user thực sự
 * nhìn thấy trang — không bị "phí" trong lúc intro che.
 */
let resolved = false
const queue: Array<() => void> = []
let watching = false

function flush() {
  resolved = true
  const pending = queue.splice(0)
  pending.forEach((fn) => fn())
}

export function whenIntroGone(cb: () => void) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    cb()
    return
  }
  if (resolved) {
    cb()
    return
  }

  queue.push(cb)

  const reduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || !document.querySelector('.intro-loader')) {
    flush()
    return
  }

  if (watching) return
  watching = true

  const mo = new MutationObserver(() => {
    if (!document.querySelector('.intro-loader')) {
      mo.disconnect()
      flush()
    }
  })
  mo.observe(document.body, { childList: true, subtree: true })

  // Fallback an toàn: nếu vì lý do gì intro không biến mất, vẫn reveal sau 9s.
  window.setTimeout(() => {
    if (!resolved) {
      mo.disconnect()
      flush()
    }
  }, 9000)
}
