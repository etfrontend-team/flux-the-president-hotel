import { chromium } from '@playwright/test'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1512, height: 900 } })
await page.goto('http://localhost:3813/', { waitUntil: 'networkidle' })
await page.screenshot({ path: '/tmp/header3-full.png' })
await page.screenshot({ path: '/tmp/header3-crop.png', clip: { x: 1150, y: 60, width: 350, height: 90 } })
await browser.close()
