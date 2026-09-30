import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OI Workforce Homepage',
  description: 'The Organisational Intelligence Platform – Increase the capacity and capability of your organisation and your people.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
