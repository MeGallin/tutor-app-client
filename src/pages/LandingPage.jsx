import MainLayout from '../components/layout/MainLayout';

/**
 * Landing page / homepage for the application
 */
export default function LandingPage() {
  return (
    <MainLayout>
      <div className="container">
        <div className="row py-5">
          <div className="col-md-6">
            <h1 className="display-4 fw-bold">Welcome to Tutor AI</h1>
            <p className="lead">Your intelligent learning companion</p>
            <p>
              Tutor AI provides personalized learning experiences to help you master
              new concepts and improve your skills efficiently.
            </p>
            <div className="mt-4">
              <a href="/login" className="btn btn-primary me-3">
                Login
              </a>
              <a href="/register" className="btn btn-outline-primary">
                Register
              </a>
            </div>
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            {/* Placeholder for hero image */}
            <div className="bg-light rounded p-5 w-100 text-center">
              <span className="display-1 text-primary">🎓</span>
              <p className="text-muted">AI-powered tutoring</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}