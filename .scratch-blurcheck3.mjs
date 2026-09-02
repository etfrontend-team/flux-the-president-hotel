import { chromium } from '@playwright/test'
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(1200)
  const card = page.locator('text=Rooms').first()
  await card.scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  const box = await card.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 5 })
  await page.waitForTimeout(700)
  await page.screenshot({ path: '.scratch-blur-desktop-hover3.png' })
} finally {
  await browser.close()
}
