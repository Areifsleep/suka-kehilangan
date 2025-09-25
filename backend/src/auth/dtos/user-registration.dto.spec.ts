import { validate } from 'class-validator';
import { UserRegistrationBodyDto } from './user-registration.dto';

describe('UserRegistrationBodyDto', () => {
  let dto: UserRegistrationBodyDto;

  beforeEach(() => {
    dto = new UserRegistrationBodyDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should pass validation with valid data', async () => {
    dto.username = 'test@example.com';
    dto.password = 'Password123!';
    dto.firstName = 'John';
    dto.lastName = 'Doe';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass validation with valid data and no lastName', async () => {
    dto.username = 'test@example.com';
    dto.password = 'Password123!';
    dto.firstName = 'John';
    // lastName is optional

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when username is not an email', async () => {
    dto.username = 'invalidemail';
    dto.password = 'Password123!';
    dto.firstName = 'John';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const usernameError = errors.find((error) => error.property === 'username');
    expect(usernameError).toBeDefined();
  });

  it('should fail validation when password is too short', async () => {
    dto.username = 'test@example.com';
    dto.password = 'Pass1!'; // too short
    dto.firstName = 'John';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError).toBeDefined();
  });

  it('should fail validation when password is too long', async () => {
    dto.username = 'test@example.com';
    dto.password = 'A'.repeat(65) + '1!'; // too long
    dto.firstName = 'John';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError).toBeDefined();
  });

  it('should fail validation when password does not meet pattern requirements', async () => {
    dto.username = 'test@example.com';
    dto.password = 'password'; // no uppercase, no number, no special char
    dto.firstName = 'John';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError).toBeDefined();
    expect(passwordError?.constraints?.matches).toBeDefined();
  });

  it('should fail validation when firstName is missing', async () => {
    dto.username = 'test@example.com';
    dto.password = 'Password123!';
    // firstName is missing

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const firstNameError = errors.find(
      (error) => error.property === 'firstName',
    );
    expect(firstNameError).toBeDefined();
  });

  it('should fail validation when firstName is not a string', async () => {
    dto.username = 'test@example.com';
    dto.password = 'Password123!';
    (dto as any).firstName = 123;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const firstNameError = errors.find(
      (error) => error.property === 'firstName',
    );
    expect(firstNameError).toBeDefined();
  });

  it('should fail validation when lastName is not a string', async () => {
    dto.username = 'test@example.com';
    dto.password = 'Password123!';
    dto.firstName = 'John';
    (dto as any).lastName = 123;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const lastNameError = errors.find((error) => error.property === 'lastName');
    expect(lastNameError).toBeDefined();
  });

  it('should pass validation with various valid passwords', async () => {
    const validPasswords = [
      'Password123!',
      'MySecur3P@ssw0rd',
      'Str0ng#Pass123',
      'C0mplex$Pass1',
    ];

    for (const password of validPasswords) {
      dto.username = 'test@example.com';
      dto.password = password;
      dto.firstName = 'John';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });
});
