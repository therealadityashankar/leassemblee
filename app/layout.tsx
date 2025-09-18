import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LeAssemblee',
  description: 'Deploy your static Next.js site to GitHub Pages.'
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
