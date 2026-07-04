import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'CivicPulse — Local Civic Engagement Hub',
  description: 'Data-driven civic engagement platform enabling citizens to report issues, vote on priorities, and track government accountability in their constituency.',
  keywords: 'civic engagement, government transparency, local issues, tenders, constituency, citizen participation',
  openGraph: {
    title: 'CivicPulse — Your Voice. Your Ward. Your Future.',
    description: 'Report issues, vote on priorities, and hold your representatives accountable.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
