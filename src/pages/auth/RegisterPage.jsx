import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

/**
 * Registration page component with form validation
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [apiError, setApiError] = useState('');
  const { showSuccess, showError } = useToast();

  // Form validation function
  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = 'Name is required';
    } else if (values.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  // Form submission handler
  const handleRegister = async (values) => {
    setApiError('');
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      // Show success message
      showSuccess('Registration successful! Redirecting to dashboard...');

      // Redirect to dashboard after successful registration
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg =
        error.message || 'Registration failed. Please try again.';
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
  } = useForm(
    { name: '', email: '', password: '', confirmPassword: '' },
    handleRegister,
    validate,
  );

  // Determine if form is valid
  const isFormValid = useMemo(() => {
    const allFieldsFilled =
      values.name && values.email && values.password && values.confirmPassword;
    const noValidationErrors = Object.keys(errors).length === 0;

    return allFieldsFilled && noValidationErrors;
  }, [values, errors]);

  return (
    <MainLayout>
      <div className="col-md-12 border px-4 bg-body-tertiary">
        <div className="py-5">
          <div className="mx-auto">
            <h2 className="mb-4">Create Account</h2>

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
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className={`form-control form-control-lg ${
                    touched.name && errors.name
                      ? 'is-invalid'
                      : touched.name
                      ? 'is-valid'
                      : ''
                  }`}
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.name && errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
                {touched.name && !errors.name && (
                  <div className="valid-feedback">Looks good!</div>
                )}
              </div>

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
                {touched.password && !errors.password && (
                  <div className="valid-feedback">Looks good!</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className={`form-control form-control-lg ${
                    touched.confirmPassword && errors.confirmPassword
                      ? 'is-invalid'
                      : touched.confirmPassword
                      ? 'is-valid'
                      : ''
                  }`}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="invalid-feedback">
                    {errors.confirmPassword}
                  </div>
                )}
                {touched.confirmPassword && !errors.confirmPassword && (
                  <div className="valid-feedback">Looks good!</div>
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
                    Creating account...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
