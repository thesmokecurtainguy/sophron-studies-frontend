'use client'

import { useEffect, useState } from 'react'

type HeroVimeoDeferredProps = {
  vimeoId: string
  /** Shown in accessibility tree only */
  iframeTitle: string
}

const VIMEO_PRECONNECT_ORIGINS = [
  'https://player.vimeo.com',
  'https://f.vimeocdn.com',
  'https://i.vimeocdn.com',
] as const

function injectVimeoPreconnects() {
  for (const href of VIMEO_PRECONNECT_ORIGINS) {
    const existing = document.head.querySelector(
      `link[rel="preconnect"][href="${href}"]`
    )
    if (existing) continue

    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = href
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  }
}

function isConnectionConstrained(): boolean {
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string }
    }
  ).connection

  // Safari/Firefox: connection is undefined — treat as unconstrained
  if (!connection) return false

  if (connection.saveData) return true

  const effectiveType = connection.effectiveType
  return (
    effectiveType === 'slow-2g' ||
    effectiveType === '2g' ||
    effectiveType === '3g'
  )
}

/**
 * Defers embedding the Vimeo player until after load + idle so the poster
 * (next/image with priority) can serve as LCP without competing for bandwidth.
 * Skips video on narrow viewports, reduced motion, and constrained connections.
 *
 * Uses standard embed params instead of background=1, which requires a paid Vimeo plan.
 */
export default function HeroVimeoDeferred({ vimeoId, iframeTitle }: HeroVimeoDeferredProps) {
  const [mountPlayer, setMountPlayer] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Viewport gate: matchMedia, not UA (iPadOS reports as desktop Safari)
    if (!window.matchMedia('(min-width: 1024px)').matches) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    if (isConnectionConstrained()) return

    let cancelled = false
    let idleCallbackId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let fadeFrameId = 0

    const mount = () => {
      if (cancelled) return
      injectVimeoPreconnects()
      setMountPlayer(true)
      // Next frame so the opacity-0 class is painted before transitioning in
      fadeFrameId = requestAnimationFrame(() => {
        if (!cancelled) setVisible(true)
      })
    }

    const scheduleIdle = () => {
      if (cancelled) return

      const ric = window.requestIdleCallback
      if (typeof ric === 'function') {
        idleCallbackId = ric(mount, { timeout: 2000 })
      } else {
        timeoutId = setTimeout(mount, 1500)
      }
    }

    const onLoad = () => {
      scheduleIdle()
    }

    if (document.readyState === 'complete') {
      scheduleIdle()
    } else {
      window.addEventListener('load', onLoad)
    }

    return () => {
      cancelled = true
      window.removeEventListener('load', onLoad)
      if (idleCallbackId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleCallbackId)
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId)
      cancelAnimationFrame(fadeFrameId)
    }
  }, [])

  if (!mountPlayer) return null

  return (
    <iframe
      title={iframeTitle}
      src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&autopause=0&muted=1&controls=0&title=0&byline=0&portrait=0&playsinline=1`}
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
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
