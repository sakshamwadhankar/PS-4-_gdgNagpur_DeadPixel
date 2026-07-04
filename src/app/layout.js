import './globals.css';

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
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
