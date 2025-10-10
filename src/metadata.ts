import type { Metadata } from 'next'

const url = 'https://lux.art'
const title = 'Lux Art'
const description = 'Cyrus Pahlavi - Sans titre (2003) - Collection Princesse Niloufar Pahlavi'

const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(url),
  applicationName: title,
  openGraph: {
    type: 'website',
    title,
    siteName: title,
    description,
    url,
    images: '/og-image.png'
  },
  twitter: {
    card: 'summary_large_image',
    site: url,
    description,
    images: '/og-image.png'
  },
  appleWebApp: {
    capable: true,
    title,
    statusBarStyle: 'black-translucent',
  },
}

export default metadata
