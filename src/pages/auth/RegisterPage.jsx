import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import useForm from '../../hooks/useForm';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

/**
 * Registration page with form for new user signup
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Form validation function
  const validateForm = (values) => {
    const errors = {};
    
    if (!values.name) {
      errors.name = 'Name is required';
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
    try {
      // When backend is ready, replace with actual API call
      // const response = await api.post('/auth/register', {
      //   name: values.name,
      //   email: values.email,
      //   password: values.password
      // });
      // login(response.data.user, response.data.token);
      
      // For now, simulate successful registration
      console.log('Registration form submitted:', values);
      alert('Registration functionality will be connected to the backend API once available.');
      
      // Redirect to dashboard or home page after registration
      // navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      // Handle registration errors
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
    { 
      name: '', 
      email: '', 
      password: '', 
      confirmPassword: '' 
    },
    validateForm,
    handleRegister
  );

  return (
    <MainLayout>
      <div className="container">
        <div className="row justify-content-center py-5">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7">
            <div className="card shadow mx-2 mx-md-0">
              <div className="card-body p-4 p-lg-5">
                <h2 className="text-center mb-4">Create Account</h2>
                
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
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
                  </div>
                  
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
                  
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <div className="invalid-feedback">{errors.confirmPassword}</div>
                    )}
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 mt-4 py-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </form>
                
                <div className="mt-4 text-center">
                  <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}