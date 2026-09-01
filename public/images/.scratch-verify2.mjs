import { chromium } from '@playwright/test'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 2400 } })
await page.goto('http://localhost:3000/experiences', { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(500)
const el = await page.$('text=Beaches')
if (el) await el.scrollIntoViewIfNeeded()
await page.waitForTimeout(1500)
await page.screenshot({ path: '.scratch-explore-full.png', fullPage: false })

const data = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('article')).map((art) => {
    const title = art.querySelector('h4')?.textContent
    const img = art.querySelector('img')
    const cs = img ? getComputedStyle(img) : null
    const rect = img ? img.getBoundingClientRect() : null
    return {
      title,
      src: img?.currentSrc?.slice(-80),
      naturalWidth: img?.naturalWidth,
      naturalHeight: img?.naturalHeight,
      objectFit: cs?.objectFit,
      objectPosition: cs?.objectPosition,
      complete: img?.complete,
      rectW: rect ? Math.round(rect.width) : null,
      rectH: rect ? Math.round(rect.height) : null,
    }
  })
})
console.log(JSON.stringify(data, null, 2))
await browser.close()
