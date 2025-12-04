import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Role } from 'src/common/constants/roles.enum';
import { AuthUserObject } from 'src/auth/types/authenticated-request';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({
        user: null as AuthUserObject | null,
      }),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

    const result = guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
  });

  it('should allow access when user has required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

    const mockRequest = {
      user: {
        id: '1',
        role: Role.ADMIN,
      } as AuthUserObject,
    };

    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue(mockRequest);

    const result = guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
  });

  it('should throw ForbiddenException when user does not have required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

    const mockRequest = {
      user: {
        id: '1',
        role: Role.USER,
      } as AuthUserObject,
    };

    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue(mockRequest);

    expect(() => guard.canActivate(mockExecutionContext)).toThrow(
      ForbiddenException,
    );
  });

  it('should throw ForbiddenException when user is not authenticated', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

    const mockRequest = {
      user: null,
    };

    jest
      .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
      .mockReturnValue(mockRequest);

    expect(() => guard.canActivate(mockExecutionContext)).toThrow(
      ForbiddenException,
    );
  });
});
