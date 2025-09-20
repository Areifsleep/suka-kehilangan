export const passwordConstraints = {
  minLength: 8,
  maxLength: 64,
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*()-]).{8,64}$/, // At least one uppercase letter, one lowercase letter, one number and one special character
};
