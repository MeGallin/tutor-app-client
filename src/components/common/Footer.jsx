/**
 * Main footer component that appears on all pages
 */
export default function Footer() {
  return (
    <footer className="footer bg-dark text-light py-3 fixed-bottom w-100">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <p className="mb-0">© {new Date().getFullYear()} Tutor AI</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="mb-0">Helping students learn effectively</p>
          </div>
        </div>
      </div>
    </footer>
  );
}