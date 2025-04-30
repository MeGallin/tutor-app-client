import Header from '../common/Header';
import Footer from '../common/Footer';

/**
 * Main layout wrapper that applies the header and footer
 * Adds appropriate padding to prevent content from being hidden
 */
export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main className="container-fluid" style={{ paddingTop: '4.5rem', paddingBottom: '3.5rem' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}