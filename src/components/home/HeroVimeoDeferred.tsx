'use client'

import { useEffect, useState } from 'react'

type HeroVimeoDeferredProps = {
  vimeoId: string
  /** Shown in accessibility tree only */
  iframeTitle: string
}

/**
 * Defers embedding the Vimeo player until after first paint so the poster (CSS
 * background) can serve as LCP. Skips video entirely when the user prefers
 * reduced motion.
 *
 * Uses standard embed params instead of background=1, which requires a paid Vimeo plan.
 */
export default function HeroVimeoDeferred({ vimeoId, iframeTitle }: HeroVimeoDeferredProps) {
  const [mountPlayer, setMountPlayer] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    let frameId = 0

    const go = () => {
      if (!cancelled) setMountPlayer(true)
    }

    // Wait two animation frames so the SSR poster can paint before third-party work.
    frameId = requestAnimationFrame(() => {
      frameId = requestAnimationFrame(go)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frameId)
    }
  }, [])

  if (!mountPlayer) return null

  return (
    <iframe
      title={iframeTitle}
      src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0&playsinline=1`}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      allow="autoplay; fullscreen"
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
