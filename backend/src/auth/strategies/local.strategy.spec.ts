import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate user with correct credentials', async () => {
      const username = 'testuser';
      const password = 'password123';
      const user = { id: '1', username: 'testuser' };

      mockAuthService.validateUser.mockResolvedValue(user);

      const result = await strategy.validate(username, password);

      expect(authService.validateUser).toHaveBeenCalledWith(username, password);
      expect(result).toEqual(user);
    });

    it('should return null for invalid credentials', async () => {
      const username = 'testuser';
      const password = 'wrongpassword';

      mockAuthService.validateUser.mockResolvedValue(null);

      const result = await strategy.validate(username, password);

      expect(authService.validateUser).toHaveBeenCalledWith(username, password);
      expect(result).toBeNull();
    });

    it('should handle authentication service errors', async () => {
      const username = 'testuser';
      const password = 'password123';

      mockAuthService.validateUser.mockRejectedValue(
        new Error('Auth service error'),
      );

      await expect(strategy.validate(username, password)).rejects.toThrow(
        'Auth service error',
      );
    });

    it('should return null for empty username and password', async () => {
      const username = '';
      const password = '';

      mockAuthService.validateUser.mockResolvedValue(null);

      const result = await strategy.validate(username, password);

      expect(authService.validateUser).toHaveBeenCalledWith(username, password);
      expect(result).toBeNull();
    });
  });
});
