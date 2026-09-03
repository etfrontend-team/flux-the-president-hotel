'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type DayNightMode = 'day' | 'night'

type DayNightContextValue = {
  mode: DayNightMode
  toggle: () => void
}

const DayNightContext = createContext<DayNightContextValue | null>(null)

/**
 * Day/night mode toggle — homepage-only per Figma annotation (node 1:23068).
 * Mirrors the mode onto `<body>` as a class so the body background (the only
 * thing that changes between modes) can be styled in CSS.
 */
export function DayNightProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DayNightMode>('day')

  useEffect(() => {
    document.body.classList.toggle('night', mode === 'night')
  }, [mode])

  const value = useMemo(
    () => ({
      mode,
      toggle: () => setMode((prev) => (prev === 'day' ? 'night' : 'day')),
    }),
    [mode],
  )

  return <DayNightContext.Provider value={value}>{children}</DayNightContext.Provider>
}

export function useDayNight() {
  const ctx = useContext(DayNightContext)
  if (!ctx) throw new Error('useDayNight must be used within a DayNightProvider')
  return ctx
}
