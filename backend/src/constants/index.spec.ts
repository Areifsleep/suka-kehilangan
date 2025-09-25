import { passwordConstraints } from './index';

describe('Constants - Index', () => {
  describe('passwordConstraints', () => {
    it('should be defined', () => {
      expect(passwordConstraints).toBeDefined();
    });

    it('should have correct minLength', () => {
      expect(passwordConstraints.minLength).toBe(8);
    });

    it('should have correct maxLength', () => {
      expect(passwordConstraints.maxLength).toBe(64);
    });

    it('should have a pattern for password validation', () => {
      expect(passwordConstraints.pattern).toBeInstanceOf(RegExp);
    });

    it('should validate strong passwords', () => {
      const strongPasswords = [
        'Password123!',
        'MySecur3P@ssw0rd',
        'Str0ng#Pass123',
        'C0mplex$Pass1',
      ];

      strongPasswords.forEach((password) => {
        expect(passwordConstraints.pattern.test(password)).toBe(true);
      });
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        'password', // no uppercase, no number, no special char
        'PASSWORD', // no lowercase, no number, no special char
        'Password', // no number, no special char
        'Password123', // no special char
        'Pass1!', // too short
        '12345678', // no letters, no special char
        'Aa1!', // too short
        '', // empty
      ];

      weakPasswords.forEach((password) => {
        expect(passwordConstraints.pattern.test(password)).toBe(false);
      });
    });
  });
});
