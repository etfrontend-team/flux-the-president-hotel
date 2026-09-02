import { chromium } from '@playwright/test'
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(1200)
  const el = page.locator('text=Where to stay').first()
  await el.scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollBy(0, 550))
  await page.waitForTimeout(500)
  await page.screenshot({ path: '.scratch-blur-mobile2.png' })

  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.waitForTimeout(300)
  const card = page.locator('text=Rooms').first()
  await card.scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)
  const box = await card.boundingBox()
  await page.mouse.move(box.x + box.width/2, box.y + 200)
  await page.waitForTimeout(700)
  await page.screenshot({ path: '.scratch-blur-desktop-hover2.png' })
} finally {
  await browser.close()
}
