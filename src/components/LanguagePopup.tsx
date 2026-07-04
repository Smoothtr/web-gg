import { useState, useEffect } from 'react'

const STORAGE_KEY = 'gg99_language'

export function LanguagePopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      // Small delay so the page renders first
      const t = setTimeout(() => setShow(true), 400)
      return () => clearTimeout(t)
    }
  }, [])

  function choose(lang: 'vi' | 'en' | 'ko') {
    localStorage.setItem(STORAGE_KEY, lang)
    setShow(false)
    const target = lang === 'en' ? '/en' : lang === 'ko' ? '/ko' : '/'
    if (window.location.pathname !== target) {
      window.location.href = target
    }
  }

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(38,24,18,0.4)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="bg-surface dark:bg-surface-container rounded-3xl p-8 max-w-xs w-full shadow-2xl text-center"
        style={{ animation: 'fadeUp 0.3s ease forwards' }}
      >
        {/* Logo */}
        <img
          src="/logo-gg.png"
          alt="The One - GG99"
          className="h-16 w-auto mx-auto mb-5"
        />

        {/* Title */}
        <h2 className="font-extrabold text-[17px] text-on-surface leading-snug mb-1">
          Chọn ngôn ngữ
        </h2>
        <p className="text-[15px] font-semibold text-on-surface-variant mb-4">
          Choose your language
        </p>
        <p className="text-[15px] font-semibold text-on-surface-variant mb-4">
          언어를 선택하세요
        </p>

        {/* Hint */}
        <p className="text-[11px] text-on-surface-variant/60 leading-relaxed mb-6">
          Bạn có thể thay đổi ngôn ngữ bất cứ lúc nào trên thanh menu.
          <br />
          You can change the language anytime from the header.
          <br />
          상단 메뉴에서 언제든지 언어를 변경할 수 있습니다.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => choose('vi')}
            className="w-full py-3.5 rounded-xl bg-primary text-on-primary gg-btn-primary font-bold text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <img src="https://flagcdn.com/24x18/vn.png" alt="VN" className="rounded-sm" />
            Tiếng Việt
          </button>
          <button
            onClick={() => choose('en')}
            className="w-full py-3.5 rounded-xl border-2 border-outline-variant text-on-surface font-bold text-base hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2"
          >
            <img src="https://flagcdn.com/24x18/gb.png" alt="EN" className="rounded-sm" />
            English
          </button>
          <button
            onClick={() => choose('ko')}
            className="w-full py-3.5 rounded-xl border-2 border-outline-variant text-on-surface font-bold text-base hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2"
          >
            <img src="https://flagcdn.com/24x18/kr.png" alt="KO" className="rounded-sm" />
            한국어
          </button>
        </div>
      </div>
    </div>
  )
}
