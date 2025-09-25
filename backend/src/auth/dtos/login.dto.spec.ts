import { validate } from 'class-validator';
import { LoginBodyDto } from './login.dto';

describe('LoginBodyDto', () => {
  let dto: LoginBodyDto;

  beforeEach(() => {
    dto = new LoginBodyDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should pass validation with valid data', async () => {
    dto.username = 'testuser';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when username is missing', async () => {
    dto.password = 'password123';
    // username is undefined

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('username');
  });

  it('should fail validation when password is missing', async () => {
    dto.username = 'testuser';
    // password is undefined

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should fail validation when username is not a string', async () => {
    (dto as any).username = 123;
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('username');
  });

  it('should fail validation when password is not a string', async () => {
    dto.username = 'testuser';
    (dto as any).password = 123;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should accept empty strings', async () => {
    dto.username = '';
    dto.password = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
