import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

/**
 * Login page with email/password form
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [apiError, setApiError] = useState('');
  const { showSuccess, showError } = useToast();

  // Form validation function
  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  // Form submission handler
  const handleLogin = async (values) => {
    setApiError('');
    try {
      await login(values.email, values.password);

      // Show success message
      showSuccess('Login successful! Redirecting to dashboard...');

      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg =
        error.message || 'Login failed. Please check your credentials.';
      setApiError(errorMsg);
      showError(errorMsg);
    }
  };

  // Initialize form using our custom hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({ email: '', password: '' }, handleLogin, validate);

  // Determine if form is valid
  const isFormValid = useMemo(() => {
    const allFieldsFilled = values.email && values.password;
    const noValidationErrors = Object.keys(errors).length === 0;

    return allFieldsFilled && noValidationErrors;
  }, [values, errors]);

  return (
    <MainLayout>
      <div className="col-md-12 border px-4 bg-body-tertiary">
        <div className="py-5">
          <div className="mx-auto">
            <h2 className="mb-4">Login</h2>

            {apiError && (
              <div className="alert alert-danger" role="alert">
                {apiError}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="needs-validation"
            >
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className={`form-control form-control-lg ${
                    touched.email && errors.email
                      ? 'is-invalid'
                      : touched.email
                      ? 'is-valid'
                      : ''
                  }`}
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.email && errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
                {touched.email && !errors.email && (
                  <div className="valid-feedback">Looks good!</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className={`form-control form-control-lg ${
                    touched.password && errors.password
                      ? 'is-invalid'
                      : touched.password
                      ? 'is-valid'
                      : ''
                  }`}
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.password && errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mt-4 py-2"
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p>
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
