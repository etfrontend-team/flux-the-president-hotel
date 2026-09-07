import { chromium } from '@playwright/test'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:3000/careers', { waitUntil: 'networkidle', timeout: 20000 })
const total = await page.evaluate(() => document.body.scrollHeight)
for (let y = 0; y <= total; y += 250) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y)
  await page.waitForTimeout(30)
}
await page.waitForTimeout(300)
const section = await page.waitForSelector('section:has-text("Front-of-House Manager")', { timeout: 8000 })
await section.scrollIntoViewIfNeeded()
await page.waitForTimeout(400)
await section.screenshot({ path: 'cl-current-state.png' })
await browser.close()
console.log('done')
