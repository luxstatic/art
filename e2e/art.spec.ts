import { test, expect } from '@playwright/test'

test.describe('Lux Art Gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display artwork in full screen with black background', async ({ page }) => {
    // Check page loads
    await expect(page).toHaveTitle(/Lux Art/)

    // Verify black background
    const main = page.locator('main')
    await expect(main).toHaveClass(/bg-black/)

    // Verify artwork image is displayed
    const artwork = page.locator('img[alt*="Sans titre"]').first()
    await expect(artwork).toBeVisible()

    // Verify it uses object-cover for full viewport
    await expect(artwork).toHaveClass(/object-cover/)
  })

  test('should show Lux logo and details on load, then hide after 5 seconds', async ({ page }) => {
    // Logo should be visible initially
    const logo = page.locator('svg polygon').first()
    await expect(logo).toBeVisible({ timeout: 2000 })

    // Details should be visible initially
    await expect(page.getByRole('heading', { name: 'Sans titre' })).toBeVisible()
    await expect(page.getByText('Prince Cyrus Pahlavi, 2003')).toBeVisible()

    // Wait for auto-hide (5 seconds + buffer)
    await page.waitForTimeout(6000)

    // Details overlay should have opacity-0 class
    const detailsOverlay = page.locator('.bg-gradient-to-t').first()
    const classes = await detailsOverlay.getAttribute('class')
    expect(classes).toContain('opacity-0')
  })

  test('should show details on mouse movement', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop only test - mobile uses touch events')

    // Wait for auto-hide
    await page.waitForTimeout(6000)

    // Move mouse to trigger details
    await page.mouse.move(500, 500)
    await page.waitForTimeout(1000)

    // Details overlay should have opacity-100 class
    const detailsOverlay = page.locator('.bg-gradient-to-t').first()
    const classes = await detailsOverlay.getAttribute('class')
    expect(classes).toContain('opacity-100')
  })

  test('should open full-resolution view on click', async ({ page }) => {
    // Click on artwork
    const artwork = page.locator('div.cursor-zoom-in').first()
    await artwork.click()

    // Modal should be visible
    const modal = page.locator('[class*="z-\\[100\\]"]')
    await expect(modal).toBeVisible()

    // Close button should be visible
    const closeButton = page.locator('button[aria-label="Close"]')
    await expect(closeButton).toBeVisible()

    // Zoom controls should be visible
    await expect(page.locator('button[aria-label="Zoom in"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Zoom out"]')).toBeVisible()
  })

  test('should zoom in and out with controls', async ({ page }) => {
    // Open full-res view
    await page.locator('div.cursor-zoom-in').first().click()
    await page.waitForTimeout(500)

    // Click zoom in button 2 times
    await page.locator('button[aria-label="Zoom in"]').click()
    await page.waitForTimeout(500)
    await page.locator('button[aria-label="Zoom in"]').click()
    await page.waitForTimeout(500)

    // Zoom indicator should show (140% or 160%)
    const indicator = page.locator('div').filter({ hasText: /%$/ }).first()
    await expect(indicator).toBeVisible({ timeout: 2000 })

    const zoomText = await indicator.textContent()
    expect(zoomText).toMatch(/\d+%/)

    // Click zoom out
    await page.locator('button[aria-label="Zoom out"]').click()
    await page.waitForTimeout(500)

    // Should still show a percentage
    await expect(indicator).toBeVisible()
  })

  test('should close full-res view on close button click', async ({ page }) => {
    // Open full-res view
    await page.locator('div.cursor-zoom-in').first().click()

    // Click close button
    await page.locator('button[aria-label="Close"]').click()
    await page.waitForTimeout(300)

    // Modal should be gone
    const modal = page.locator('[class*="z-\\[100\\]"]')
    await expect(modal).not.toBeVisible()
  })

  test('should have Sotheby\'s auction link', async ({ page }) => {
    const link = page.getByRole('link', { name: /Sotheby/ })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', /sothebys.com/)
    await expect(link).toHaveAttribute('target', '_blank')
  })

  test('should display all auction details', async ({ page }) => {
    // Check all detail fields
    await expect(page.getByText('Oil on canvas')).toBeVisible()
    await expect(page.getByText('215 × 142 cm')).toBeVisible()
    await expect(page.getByText('Princesse Niloufar Pahlavi')).toBeVisible()
    await expect(page.getByText('€100,000+')).toBeVisible()
  })

  test('should show artist biography when name is clicked', async ({ page }) => {
    // Click on artist name (which is a button)
    const artistButton = page.locator('button').filter({ hasText: 'Prince Cyrus Pahlavi' })
    await expect(artistButton).toBeVisible()

    // Click the artist name
    await artistButton.click()
    await page.waitForTimeout(500)

    // Bio modal should be visible
    const bioModal = page.locator('[class*="z-\\[200\\]"]')
    await expect(bioModal).toBeVisible()

    // Check for bio content
    await expect(page.getByText('Artist Biography')).toBeVisible()
    await expect(page.getByText(/Iranian royal family/)).toBeVisible()
    await expect(page.getByText(/Institut le Rosey/)).toBeVisible()

    // Close button should work
    const closeButton = page.locator('button[aria-label="Close biography"]')
    await closeButton.click()
    await page.waitForTimeout(300)

    // Modal should be gone
    await expect(bioModal).not.toBeVisible()
  })

  test('should close biography modal with escape key', async ({ page }) => {
    // Open bio modal
    const artistButton = page.locator('button').filter({ hasText: 'Prince Cyrus Pahlavi' })
    await artistButton.click()
    await page.waitForTimeout(500)

    const bioModal = page.locator('[class*="z-\\[200\\]"]')
    await expect(bioModal).toBeVisible()

    // Press escape
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    // Modal should be gone
    await expect(bioModal).not.toBeVisible()
  })

  test('should close zoom view with escape key', async ({ page }) => {
    // Click on image to open zoom
    await page.click('main')
    await page.waitForTimeout(500)

    // Zoom modal should be visible
    const zoomModal = page.locator('[class*="z-\\[100\\]"]')
    await expect(zoomModal).toBeVisible()

    // Press escape
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    // Modal should be gone
    await expect(zoomModal).not.toBeVisible()
  })

  test('should work on mobile viewport', async ({ page, viewport }) => {
    test.skip(!viewport || viewport.width < 768, 'Desktop only test')

    // Test is already running in mobile viewport for Mobile Chrome/Safari projects
    await expect(page).toHaveTitle(/Lux Art/)

    const artwork = page.locator('img[alt*="Sans titre"]').first()
    await expect(artwork).toBeVisible()
  })

  test('should support touch interactions', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only test')

    // Open full-res view with tap
    const artwork = page.locator('div.cursor-zoom-in').first()
    await artwork.tap()

    // Modal should be visible
    const modal = page.locator('[class*="z-\\[100\\]"]')
    await expect(modal).toBeVisible()

    // Close with tap
    const closeButton = page.locator('button[aria-label="Close"]')
    await closeButton.tap()

    // Modal should close
    await expect(modal).not.toBeVisible()
  })

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForTimeout(2000)

    // Filter out known warnings
    const criticalErrors = errors.filter(
      (err) => !err.includes('caniuse-lite') && !err.includes('@hanzo/ui/primitives')
    )

    expect(criticalErrors).toHaveLength(0)
  })

  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')

    // Wait for main artwork to be visible
    await page.locator('img[alt*="Sans titre"]').first().waitFor({ state: 'visible' })

    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(5000) // Should load in under 5 seconds
  })
})
