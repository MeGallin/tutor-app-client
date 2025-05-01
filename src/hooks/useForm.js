import { useState, useCallback } from 'react';

/**
 * Custom hook for form state management
 *
 * @param {Object} initialValues - Initial form field values
 * @param {Function} onSubmit - Function to call when form is submitted
 * @param {Function} validate - Optional validation function
 * @returns {Object} Form state and handlers
 */
export function useForm(
  initialValues = {},
  onSubmit = () => {},
  validate = null,
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  /**
   * Handle input changes
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Set a specific field value programmatically
   */
  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Track which fields have been touched/focused
   */
  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Validate the field if validation function is provided
      if (validate) {
        const fieldErrors = validate(values);
        setErrors(fieldErrors);
      }
    },
    [values, validate],
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {},
      );
      setTouched(allTouched);

      // Validate if provided
      let validationErrors = {};
      if (validate) {
        validationErrors = validate(values);
        setErrors(validationErrors);
      }

      // Only proceed if no errors
      if (Object.keys(validationErrors).length === 0) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (err) {
          // Handle submission errors
          setErrors((prev) => ({
            ...prev,
            form: err.message || 'An error occurred',
          }));
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, onSubmit, validate],
  );

  /**
   * Reset the form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    resetForm,
    setErrors,
  };
}
