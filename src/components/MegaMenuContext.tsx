'use client'

import React from 'react'

type MegaMenuContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const MegaMenuContext = React.createContext<MegaMenuContextValue | null>(null)

/** Shared open/close state for the mega menu, since both of Header's nav bars (the transparent overlay and the sticky reveal) trigger it. */
export function MegaMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const value = React.useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((prev) => !prev),
    }),
    [isOpen],
  )

  return <MegaMenuContext.Provider value={value}>{children}</MegaMenuContext.Provider>
}

export function useMegaMenu() {
  const ctx = React.useContext(MegaMenuContext)
  if (!ctx) throw new Error('useMegaMenu must be used within a MegaMenuProvider')
  return ctx
}
