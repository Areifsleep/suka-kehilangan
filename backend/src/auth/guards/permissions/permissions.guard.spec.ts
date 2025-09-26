import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from './permissions.guard';
import { PERMISSIONS_KEY } from 'src/common/decorators/permissions.decorator';
import { Permission } from 'src/common/constants/permissions.enum';
import { AuthUserObject } from 'src/auth/types/authenticated-request';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;

  const mockRequest = {
    user: null as AuthUserObject | null,
  };

  const mockHttpContext = {
    getRequest: jest.fn().mockReturnValue(mockRequest),
  };

  const mockExecutionContext = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn().mockReturnValue(mockHttpContext),
  } as any as ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new PermissionsGuard(reflector);

    // Reset mocks
    jest.clearAllMocks();
    mockRequest.user = null;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when no permissions are required', () => {
      // Mock no required permissions
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
        PERMISSIONS_KEY,
        [mockExecutionContext.getHandler(), mockExecutionContext.getClass()],
      );
    });

    it('should return true when required permissions array is empty', () => {
      // Mock empty permissions array
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user is not present', () => {
      // Mock required permissions
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([Permission.CreateReportFound]);

      // User is null (already set in beforeEach)
      mockRequest.user = null;

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Insufficient permissions',
      );
    });

    it('should throw ForbiddenException when user has no permissions property', () => {
      // Mock required permissions
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([Permission.CreateReportFound]);

      // User without permissions property
      mockRequest.user = {
        id: '1',
        full_name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      } as any; // Cast to any to simulate missing permissions property

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Insufficient permissions',
      );
    });

    it('should return true when user has all required permissions', () => {
      // Mock required permissions
      const requiredPermissions = [
        Permission.CreateReportFound,
        Permission.ViewOwnReports,
      ];
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue(requiredPermissions);

      // User with required permissions
      mockRequest.user = {
        id: '1',
        full_name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        permissions: [
          Permission.CreateReportFound,
          Permission.ViewOwnReports,
          Permission.UpdateOwnReport,
        ],
      };

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should return true when user has exactly the required permissions', () => {
      // Mock required permissions
      const requiredPermissions = [Permission.CreateReportFound];
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue(requiredPermissions);

      // User with exact required permissions
      mockRequest.user = {
        id: '1',
        full_name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        permissions: [Permission.CreateReportFound],
      };

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user is missing some required permissions', () => {
      // Mock required permissions
      const requiredPermissions = [
        Permission.CreateReportFound,
        Permission.ViewAllReports,
      ];
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue(requiredPermissions);

      // User missing some permissions
      mockRequest.user = {
        id: '1',
        full_name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        permissions: [Permission.CreateReportFound], // Missing ViewAllReports
      };

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Insufficient permissions',
      );
    });

    it('should throw ForbiddenException when user has no required permissions', () => {
      // Mock required permissions
      const requiredPermissions = [Permission.ManageUsers];
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue(requiredPermissions);

      // User with different permissions
      mockRequest.user = {
        id: '1',
        full_name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        permissions: [Permission.CreateReportFound, Permission.ViewOwnReports],
      };

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Insufficient permissions',
      );
    });

    it('should throw ForbiddenException when user has empty permissions array', () => {
      // Mock required permissions
      const requiredPermissions = [Permission.CreateReportFound];
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue(requiredPermissions);

      // User with empty permissions
      mockRequest.user = {
        id: '1',
        full_name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        permissions: [],
      };

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Insufficient permissions',
      );
    });

    it('should handle multiple required permissions correctly', () => {
      // Mock multiple required permissions
      const requiredPermissions = [
        Permission.CreateReportFound,
        Permission.ViewOwnReports,
        Permission.UpdateOwnReport,
        Permission.DeleteOwnReport,
      ];
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue(requiredPermissions);

      // User with all required permissions plus extra
      mockRequest.user = {
        id: '1',
        full_name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin',
        permissions: [
          Permission.CreateReportFound,
          Permission.ViewOwnReports,
          Permission.ViewAllReports,
          Permission.UpdateOwnReport,
          Permission.UpdateAnyReport,
          Permission.DeleteOwnReport,
          Permission.DeleteAnyReport,
          Permission.ManageUsers,
        ],
      };

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should correctly use reflector.getAllAndOverride with proper parameters', () => {
      const spy = jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([]);

      guard.canActivate(mockExecutionContext);

      expect(spy).toHaveBeenCalledWith(PERMISSIONS_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
    });

    it('should work with all permission enum values', () => {
      // Test with all permissions
      const allPermissions = Object.values(Permission);
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([Permission.ExportReports]);

      // User with all permissions
      mockRequest.user = {
        id: '1',
        full_name: 'Super Admin',
        username: 'superadmin',
        email: 'admin@example.com',
        role: 'super_admin',
        permissions: allPermissions,
      };

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });
  });
});
