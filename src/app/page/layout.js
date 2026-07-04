import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PageLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
