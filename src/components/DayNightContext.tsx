'use client'

import React from 'react'

type DayNightMode = 'day' | 'night'

type DayNightContextValue = {
  mode: DayNightMode
  toggle: () => void
}

const DayNightContext = React.createContext<DayNightContextValue | null>(null)

/**
 * Day/night mode toggle — homepage-only per Figma annotation (node 1:23068).
 * Mirrors the mode onto `<body>` as a class so the body background (the only
 * thing that changes between modes) can be styled in CSS.
 */
export function DayNightProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<DayNightMode>('day')

  React.useEffect(() => {
    document.body.classList.toggle('night', mode === 'night')
  }, [mode])

  const value = React.useMemo(
    () => ({
      mode,
      toggle: () => setMode((prev) => (prev === 'day' ? 'night' : 'day')),
    }),
    [mode],
  )

  return <DayNightContext.Provider value={value}>{children}</DayNightContext.Provider>
}

export function useDayNight() {
  const ctx = React.useContext(DayNightContext)
  if (!ctx) throw new Error('useDayNight must be used within a DayNightProvider')
  return ctx
}
