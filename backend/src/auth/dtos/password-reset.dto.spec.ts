import { validate } from 'class-validator';
import {
  PasswordResetBodyDto,
  PasswordResetRequestBodyDto,
} from './password-reset.dto';

describe('PasswordResetBodyDto', () => {
  let dto: PasswordResetBodyDto;

  beforeEach(() => {
    dto = new PasswordResetBodyDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should pass validation with valid data', async () => {
    dto.password = 'Password123!';
    dto.token = '550e8400-e29b-41d4-a716-446655440000';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when password is too short', async () => {
    dto.password = 'Pass1!'; // too short
    dto.token = '550e8400-e29b-41d4-a716-446655440000';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError).toBeDefined();
  });

  it('should fail validation when password does not meet pattern requirements', async () => {
    dto.password = 'password'; // no uppercase, no number, no special char
    dto.token = '550e8400-e29b-41d4-a716-446655440000';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError).toBeDefined();
    expect(passwordError?.constraints?.matches).toBeDefined();
  });

  it('should fail validation when token is not a valid UUID', async () => {
    dto.password = 'Password123!';
    dto.token = 'invalid-uuid';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const tokenError = errors.find((error) => error.property === 'token');
    expect(tokenError).toBeDefined();
    expect(tokenError?.constraints?.isUuid).toBeDefined();
  });

  it('should fail validation when password is missing', async () => {
    dto.token = '550e8400-e29b-41d4-a716-446655440000';
    // password is undefined

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError).toBeDefined();
  });

  it('should fail validation when token is missing', async () => {
    dto.password = 'Password123!';
    // token is undefined

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const tokenError = errors.find((error) => error.property === 'token');
    expect(tokenError).toBeDefined();
  });
});

describe('PasswordResetRequestBodyDto', () => {
  let dto: PasswordResetRequestBodyDto;

  beforeEach(() => {
    dto = new PasswordResetRequestBodyDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should pass validation with valid email', async () => {
    dto.email = 'test@example.com';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when email is invalid', async () => {
    dto.email = 'invalid-email';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const emailError = errors.find((error) => error.property === 'email');
    expect(emailError).toBeDefined();
    expect(emailError?.constraints?.isEmail).toBeDefined();
  });

  it('should fail validation when email is missing', async () => {
    // email is undefined

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const emailError = errors.find((error) => error.property === 'email');
    expect(emailError).toBeDefined();
  });

  it('should accept various valid email formats', async () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
      'firstname.lastname@company.com',
    ];

    for (const email of validEmails) {
      dto.email = email;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });
});
