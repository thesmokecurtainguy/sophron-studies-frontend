'use client'

import { useEffect, useState } from 'react'

type HeroVimeoDeferredProps = {
  vimeoId: string
  /** Shown in accessibility tree only */
  iframeTitle: string
}

/**
 * Defers embedding the Vimeo player until after first paint / idle time so the
 * poster (CSS background) can serve as LCP and less third-party work runs during load.
 * Skips video entirely when the user prefers reduced motion.
 */
export default function HeroVimeoDeferred({ vimeoId, iframeTitle }: HeroVimeoDeferredProps) {
  const [mountPlayer, setMountPlayer] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    const go = () => {
      if (!cancelled) setMountPlayer(true)
    }

    const ric = window.requestIdleCallback
    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (typeof ric === 'function') {
      idleId = ric.call(window, go, { timeout: 2200 })
    } else {
      timeoutId = setTimeout(go, 2000)
    }

    return () => {
      cancelled = true
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }
  }, [])

  if (!mountPlayer) return null

  return (
    <iframe
      title={iframeTitle}
      src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&muted=1&controls=0&background=1`}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      allow="autoplay; fullscreen"
      loading="lazy"
      style={{
        pointerEvents: 'none',
        width: 'max(100%, calc(100vh * 16/9))',
        height: 'max(100%, calc(100vw * 9/16))',
        minWidth: '100%',
        minHeight: '100%',
      }}
    />
  )
}
