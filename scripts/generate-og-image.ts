import { chromium } from '@playwright/test'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateOGImage() {
  console.log('Starting OG image generation...')

  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 }
  })

  // Navigate to the page
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle' })

  // Wait a bit for the page to fully render
  await page.waitForTimeout(2000)

  // Take screenshot
  const screenshot = await page.screenshot({
    type: 'png',
    clip: {
      x: 0,
      y: 0,
      width: 1200,
      height: 630
    }
  })

  await browser.close()

  // Save the image
  const outputDir = join(process.cwd(), 'public')
  try {
    mkdirSync(outputDir, { recursive: true })
  } catch (e) {
    // Directory already exists
  }

  const outputPath = join(outputDir, 'og-image.png')
  writeFileSync(outputPath, screenshot)

  console.log(`✓ OG image generated: ${outputPath}`)
  console.log('  Size: 1200x630px')
}

generateOGImage().catch(console.error)
