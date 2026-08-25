import { chromium } from '@playwright/test'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1512, height: 300 } })
await page.goto('http://localhost:3813/', { waitUntil: 'networkidle' })
await page.screenshot({ path: '/tmp/header2-desktop.png' })
await page.setViewportSize({ width: 390, height: 300 })
await page.screenshot({ path: '/tmp/header2-mobile.png' })
await browser.close()
