import Header from '../common/Header';
import Footer from '../common/Footer';

/**
 * Main layout wrapper that applies the header and footer
 * Centers content both vertically and horizontally using flexbox
 * Maintains height calculation to account for fixed header and footer
 */
export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main
        className="container-fluid d-flex justify-content-center align-items-center"
        style={{
          minHeight:
            'calc(100vh - 9rem)' /* 100vh minus header and footer height */,
        }}
      >
        <div className="w-100">{children}</div>
      </main>
      <Footer />
    </>
  );
}
