import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'LeAssemblee',
    template: '%s · LeAssemblee',
  },
  description:
    'LeAssemblee — connect and control robots from any device in the browser. Plug a robot into a Chromium desktop and control it remotely using a short connection code.',
  keywords: [
    'robot',
    'remote control',
    'web serial',
    'webrtc',
    'peerjs',
    'remote robot',
    'leassemblee',
  ],
  authors: [{ name: 'LeAssemblee', url: 'https://leassemblee.com' }],
  openGraph: {
    title: 'LeAssemblee',
    description:
      'Connect and control physical robots from any browser — use a Chromium-based desktop to attach a robot and control it remotely from another device.',
    url: 'https://leassemblee.com',
    siteName: 'LeAssemblee',
    images: ['/favicon.png'],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LeAssemblee',
    description:
      'Connect and control physical robots from any browser — plug a robot into a Chromium desktop and control it remotely.',
    images: ['/favicon.png'],
  },
  themeColor: '#0ea5e9',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="cupcake">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png"></link>
      </head>
      <body>{children}</body>
    </html>
  );
}
