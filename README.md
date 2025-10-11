# art

## Currently Featured

**"Sans titre" (2003)** by Prince Cyrus Pahlavi
Oil on canvas laid down on metal panel
215.4 × 142 cm (84 ⅞ × 56 in)

From the Collection Princesse Niloufar Pahlavi
Sotheby's Auction - Estimate: €100,000+

## Features

- Full-screen artwork display with viewport-filling crop
- Animated details that fade in/out gracefully
- Click-to-zoom with pan controls
- Mouse wheel zoom support
- Touch gestures for mobile (pinch-to-zoom, drag-to-pan)
- Responsive design for all devices
- Latest @hanzo/ui 5.1.0 components

## Development

```bash
pnpm install
pnpm dev
```

## Testing

```bash
pnpm test:e2e          # Run E2E tests
pnpm test:e2e:ui       # Run with UI
pnpm test:e2e:debug    # Debug mode
```

## Build

```bash
pnpm build
pnpm prod
```

## Deployment

Automatically deploys to **lux.art** when:
- Tests pass
- Build succeeds
- Changes pushed to `main` branch
