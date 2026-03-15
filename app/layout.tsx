import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hinge Harmonium',
  description: 'Play music with your MacBook lid angle',
  authors: [{ name: 'Rajyavardhan Bhandari' }],
  openGraph: {
    title: 'Hinge Harmonium',
    description: 'Your MacBook lid is an instrument. Open and close to play.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
