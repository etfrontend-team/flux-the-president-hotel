import { chromium } from '@playwright/test'

const browser = await chromium.launch()

async function shoot(url, width, height, filename, waitSelector) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto(url, { waitUntil: 'networkidle' })
  const total = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y <= total; y += 250) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await page.waitForTimeout(35)
  }
  await page.waitForTimeout(300)
  const section = await page.$(waitSelector)
  await section.scrollIntoViewIfNeeded()
  await page.waitForTimeout(200)
  await section.screenshot({ path: filename })
  await page.close()
}

await shoot('http://localhost:3000/loyalty', 1440, 900, 'loyalty-desktop.png', 'section:has-text("SIGNING UP FREE")')
await shoot('http://localhost:3000/loyalty', 390, 844, 'loyalty-mobile.png', 'section:has-text("SIGNING UP FREE")')
await shoot('http://localhost:3000/pets', 1440, 900, 'pets-desktop.png', 'section:has-text("About Pets")')
await shoot('http://localhost:3000/sustainability', 1440, 900, 'sustain-splitinfo-desktop.png', 'section:has-text("Cocktails for a Cause")')

await browser.close()
console.log('done')
