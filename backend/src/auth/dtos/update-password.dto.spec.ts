import { validate } from 'class-validator';
import { UpdatePasswordBodyDto } from './update-password.dto';

describe('UpdatePasswordBodyDto', () => {
  let dto: UpdatePasswordBodyDto;

  beforeEach(() => {
    dto = new UpdatePasswordBodyDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should pass validation with valid data', async () => {
    dto.newPassword = 'NewPassword123!';
    dto.confirmPassword = 'NewPassword123!';
    dto.currentPassword = 'CurrentPassword123!';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when newPassword is empty', async () => {
    dto.newPassword = '';
    dto.confirmPassword = 'NewPassword123!';
    dto.currentPassword = 'CurrentPassword123!';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const newPasswordError = errors.find(
      (error) => error.property === 'newPassword',
    );
    expect(newPasswordError).toBeDefined();
  });

  it('should fail validation when newPassword is too short', async () => {
    dto.newPassword = 'Pass1!'; // too short
    dto.confirmPassword = 'Pass1!';
    dto.currentPassword = 'CurrentPassword123!';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const newPasswordError = errors.find(
      (error) => error.property === 'newPassword',
    );
    expect(newPasswordError).toBeDefined();
  });

  it('should fail validation when newPassword does not meet pattern requirements', async () => {
    dto.newPassword = 'password'; // no uppercase, no number, no special char
    dto.confirmPassword = 'password';
    dto.currentPassword = 'CurrentPassword123!';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const newPasswordError = errors.find(
      (error) => error.property === 'newPassword',
    );
    expect(newPasswordError).toBeDefined();
    expect(newPasswordError?.constraints?.matches).toBeDefined();
  });

  it('should fail validation when confirmPassword is empty', async () => {
    dto.newPassword = 'NewPassword123!';
    dto.confirmPassword = '';
    dto.currentPassword = 'CurrentPassword123!';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const confirmPasswordError = errors.find(
      (error) => error.property === 'confirmPassword',
    );
    expect(confirmPasswordError).toBeDefined();
  });

  it('should fail validation when currentPassword is empty', async () => {
    dto.newPassword = 'NewPassword123!';
    dto.confirmPassword = 'NewPassword123!';
    dto.currentPassword = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const currentPasswordError = errors.find(
      (error) => error.property === 'currentPassword',
    );
    expect(currentPasswordError).toBeDefined();
  });

  it('should fail validation when newPassword is missing', async () => {
    dto.confirmPassword = 'NewPassword123!';
    dto.currentPassword = 'CurrentPassword123!';
    // newPassword is undefined

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const newPasswordError = errors.find(
      (error) => error.property === 'newPassword',
    );
    expect(newPasswordError).toBeDefined();
  });

  it('should fail validation when confirmPassword is missing', async () => {
    dto.newPassword = 'NewPassword123!';
    dto.currentPassword = 'CurrentPassword123!';
    // confirmPassword is undefined

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const confirmPasswordError = errors.find(
      (error) => error.property === 'confirmPassword',
    );
    expect(confirmPasswordError).toBeDefined();
  });

  it('should fail validation when currentPassword is missing', async () => {
    dto.newPassword = 'NewPassword123!';
    dto.confirmPassword = 'NewPassword123!';
    // currentPassword is undefined

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const currentPasswordError = errors.find(
      (error) => error.property === 'currentPassword',
    );
    expect(currentPasswordError).toBeDefined();
  });

  it('should pass validation with various valid newPasswords', async () => {
    const validPasswords = [
      'Password123!',
      'MySecur3P@ssw0rd',
      'Str0ng#Pass123',
      'C0mplex$Pass1',
    ];

    for (const password of validPasswords) {
      dto.newPassword = password;
      dto.confirmPassword = password;
      dto.currentPassword = 'CurrentPassword123!';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });
});
