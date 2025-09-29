import { useState, useCallback } from "react";

/**
 * Custom hook for form validation
 * @param {Object} validationRules - Object containing validation rules for each field
 * @returns {Object} - Object containing errors, validate function, clearErrors function, and clearError function
 */
export const useFormValidation = (validationRules) => {
  const [errors, setErrors] = useState({});

  const validate = useCallback(
    (formData) => {
      const newErrors = {};

      Object.keys(validationRules).forEach((field) => {
        const rules = validationRules[field];
        const value = formData[field];

        rules.forEach((rule) => {
          if (rule.test && !rule.test(value)) {
            newErrors[field] = rule.message;
            return; // Stop at first error for this field
          }
        });
      });

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [validationRules]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearError = useCallback((field) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validate,
    clearErrors,
    clearError,
  };
};

// Common validation rules
export const validationRules = {
  required: (message = "Field ini diperlukan") => ({
    test: (value) => value && value.trim().length > 0,
    message,
  }),
  minLength: (min, message) => ({
    test: (value) => !value || value.length >= min,
    message: message || `Minimal ${min} karakter diperlukan`,
  }),
  maxLength: (max, message) => ({
    test: (value) => !value || value.length <= max,
    message: message || `Maksimal ${max} karakter diizinkan`,
  }),
  email: (message = "Format email tidak valid") => ({
    test: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),
  username: (message = "Username hanya boleh berisi huruf, angka, dan garis bawah") => ({
    test: (value) => !value || /^[a-zA-Z0-9_]+$/.test(value),
    message,
  }),
};
