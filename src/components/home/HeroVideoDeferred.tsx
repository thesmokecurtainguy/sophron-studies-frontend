'use client'

import { useEffect, useRef, useState } from 'react'

const VIDEO_SRC = '/videos/hero-loop.mp4'

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
 * Defers mounting the self-hosted hero video until after load + idle so the
 * poster (next/image with priority) can serve as LCP without competing for
 * bandwidth. Skips video on narrow viewports, reduced motion, and constrained
 * connections. Replaces the old Vimeo iframe — no third-party embed, no
 * preconnect injection needed.
 */
export default function HeroVideoDeferred() {
  const [mountPlayer, setMountPlayer] = useState(false)
  const [visible, setVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

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
      setMountPlayer(true)
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

  // Some mobile/embedded browsers ignore the autoPlay attribute on first
  // mount even when muted. Explicitly call play() as a safety net.
  useEffect(() => {
    if (mountPlayer && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked — video stays on its first frame, an acceptable
        // fallback since it's purely decorative.
      })
    }
  }, [mountPlayer])

  if (!mountPlayer) return null

  return (
    <video
      ref={videoRef}
      aria-hidden="true"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ pointerEvents: 'none' }}
    >
      <source src={VIDEO_SRC} type="video/mp4" />
    </video>
  )
}
