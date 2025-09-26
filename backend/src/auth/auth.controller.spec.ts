import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import {
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { type AuthenticatedRequest } from './types/authenticated-request';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signIn: jest.fn(),
    signOut: jest.fn(),
    refresh: jest.fn(),
  };

  const mockUser = {
    id: '1',
    full_name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    role: 'admin',
    permissions: ['read', 'write'],
  };

  const mockTokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    jti: 'test-jti',
  };

  const mockRequest = {
    user: mockUser,
  } as AuthenticatedRequest;

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    json: jest.fn(),
  } as any as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      mockAuthService.signIn.mockResolvedValue(mockTokens);

      const result = await controller.login(mockRequest, mockResponse);

      expect(authService.signIn).toHaveBeenCalledWith('1');
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        mockTokens.accessToken,
        {
          httpOnly: true,
          secure: false, // NODE_ENV is not 'production' in tests
          sameSite: 'strict',
          maxAge: 900000, // 15 minutes in milliseconds
        },
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refresh_token',
        mockTokens.refreshToken,
        {
          httpOnly: true,
          secure: false, // NODE_ENV is not 'production' in tests
          sameSite: 'strict',
          maxAge: 86400000, // 1 day in milliseconds
        },
      );
      expect(result).toEqual({
        data: {
          access_token: mockTokens.accessToken,
          refresh_token: mockTokens.refreshToken,
        },
        pagination: null,
      });
    });

    it('should throw UnauthorizedException when user is missing', async () => {
      const requestWithoutUser = {} as AuthenticatedRequest;

      await expect(
        controller.login(requestWithoutUser, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw InternalServerErrorException when tokens are missing', async () => {
      mockAuthService.signIn.mockResolvedValue({
        accessToken: null,
        refreshToken: 'refresh-token',
      });

      await expect(controller.login(mockRequest, mockResponse)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      mockAuthService.signOut.mockResolvedValue(undefined);

      const result = await controller.logout(mockRequest, mockResponse);

      expect(authService.signOut).toHaveBeenCalledWith('1');
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('access_token');
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refresh_token', {
        httpOnly: true,
        secure: false, // NODE_ENV is not 'production' in tests
        sameSite: 'strict',
      });
      expect(result).toEqual({
        data: {
          success: true,
        },
        pagination: null,
      });
    });
  });

  describe('getSession', () => {
    it('should get session successfully', async () => {
      const result = await controller.getSession(mockRequest);

      expect(result).toEqual({
        data: mockUser,
        pagination: null,
      });
    });

    it('should throw UnauthorizedException when user is missing', async () => {
      const requestWithoutUser = {} as AuthenticatedRequest;

      await expect(controller.getSession(requestWithoutUser)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refresh', () => {
    it('should refresh token successfully', async () => {
      const newAccessToken = 'new-access-token';
      mockAuthService.refresh.mockResolvedValue({ newAccessToken });

      const result = await controller.refresh(mockRequest, mockResponse);

      expect(authService.refresh).toHaveBeenCalledWith('1');
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        newAccessToken,
        {
          httpOnly: true,
          secure: false, // NODE_ENV is not 'production' in tests
          sameSite: 'strict',
          maxAge: 900000, // 15 minutes in milliseconds
        },
      );
      expect(result).toEqual({
        data: {
          access_token: newAccessToken,
        },
        pagination: null,
      });
    });

    it('should throw UnauthorizedException when user is missing', async () => {
      const requestWithoutUser = {} as AuthenticatedRequest;

      await expect(
        controller.refresh(requestWithoutUser, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw InternalServerErrorException when newAccessToken is missing', async () => {
      mockAuthService.refresh.mockResolvedValue({ newAccessToken: null });

      await expect(
        controller.refresh(mockRequest, mockResponse),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
