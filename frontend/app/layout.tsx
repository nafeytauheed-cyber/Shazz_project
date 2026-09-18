import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sherpa',
  description: 'AI onboarding copilot',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
