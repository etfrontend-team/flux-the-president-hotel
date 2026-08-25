import React from 'react'
import { site } from '@/config/site.config'
import { SmoothScroll } from '@/components/SmoothScroll'
import { Header } from '@/components/Header'
import './css/styles.css'

export const metadata = {
  description: site.meta.description,
  title: site.meta.title,
  icons: {
    icon: '/images/favicon.png',
  },
}


export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/axz1hdw.css" />
      </head>
      <body>
        <SmoothScroll>
          <div className="relative">
            <Header />
            <main>{children}</main>
          </div>
        </SmoothScroll>
      </body>
    </html>
  )
}
