import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import useForm from '../../hooks/useForm';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

/**
 * Login page with email/password form
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Form validation function
  const validateForm = (values) => {
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
    try {
      // When backend is ready, replace this with actual API call
      // const response = await api.post('/auth/login', values);
      // login(response.data.user, response.data.token);
      
      // For now, simulate successful login
      console.log('Login form submitted:', values);
      alert('Login functionality will be connected to the backend API once available.');
      
      // Redirect to dashboard or home page after login
      // navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      // Handle login errors
    }
  };
  
  // Initialize the form using our custom hook
  const { 
    values, 
    errors, 
    touched,
    isSubmitting,
    handleChange, 
    handleBlur, 
    handleSubmit 
  } = useForm(
    { email: '', password: '' },
    validateForm,
    handleLogin
  );

  return (
    <MainLayout>
      <div className="container">
        <div className="row justify-content-center py-5">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7">
            <div className="card shadow mx-2 mx-md-0">
              <div className="card-body p-4 p-lg-5">
                <h2 className="text-center mb-4">Login</h2>
                
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
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
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </button>
                </form>
                
                <div className="mt-4 text-center">
                  <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}