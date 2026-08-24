import React from 'react'
import { site } from '@/config/site.config'
import './styles.css'

export const metadata = {
  description: site.meta.description,
  title: site.meta.title,
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
