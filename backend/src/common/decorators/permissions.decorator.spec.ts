import { Reflector } from '@nestjs/core';
import { Permissions, PERMISSIONS_KEY } from './permissions.decorator';
import { Permission } from '../constants/permissions.enum';

describe('Permissions Decorator', () => {
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
  });

  describe('PERMISSIONS_KEY', () => {
    it('should have the correct metadata key', () => {
      expect(PERMISSIONS_KEY).toBe('permissions');
    });
  });

  describe('Permissions', () => {
    it('should set metadata with single permission', () => {
      // Create a test class and method
      class TestController {
        @Permissions(Permission.CreateReportFound)
        testMethod() {}
      }

      const metadata = reflector.get(
        PERMISSIONS_KEY,
        TestController.prototype.testMethod,
      );
      expect(metadata).toEqual([Permission.CreateReportFound]);
    });

    it('should set metadata with multiple permissions as separate arguments', () => {
      class TestController {
        @Permissions(Permission.CreateReportFound, Permission.ViewOwnReports)
        testMethod() {}
      }

      const metadata = reflector.get(
        PERMISSIONS_KEY,
        TestController.prototype.testMethod,
      );
      expect(metadata).toEqual([
        Permission.CreateReportFound,
        Permission.ViewOwnReports,
      ]);
    });

    it('should set metadata with array of permissions', () => {
      const permissions = [
        Permission.CreateReportFound,
        Permission.ViewOwnReports,
      ];

      class TestController {
        @Permissions(permissions)
        testMethod() {}
      }

      const metadata = reflector.get(
        PERMISSIONS_KEY,
        TestController.prototype.testMethod,
      );
      expect(metadata).toEqual(permissions);
    });

    it('should flatten nested arrays of permissions', () => {
      const permissions1 = [
        Permission.CreateReportFound,
        Permission.ViewOwnReports,
      ];
      const permissions2 = [
        Permission.UpdateOwnReport,
        Permission.DeleteOwnReport,
      ];

      class TestController {
        @Permissions(permissions1, permissions2)
        testMethod() {}
      }

      const metadata = reflector.get(
        PERMISSIONS_KEY,
        TestController.prototype.testMethod,
      );
      expect(metadata).toEqual([
        Permission.CreateReportFound,
        Permission.ViewOwnReports,
        Permission.UpdateOwnReport,
        Permission.DeleteOwnReport,
      ]);
    });

    it('should handle mixed arguments (single permissions and arrays)', () => {
      class TestController {
        @Permissions(
          Permission.CreateReportFound,
          [Permission.ViewOwnReports, Permission.UpdateOwnReport],
          Permission.DeleteOwnReport,
        )
        testMethod() {}
      }

      const metadata = reflector.get(
        PERMISSIONS_KEY,
        TestController.prototype.testMethod,
      );
      expect(metadata).toEqual([
        Permission.CreateReportFound,
        Permission.ViewOwnReports,
        Permission.UpdateOwnReport,
        Permission.DeleteOwnReport,
      ]);
    });

    it('should handle empty permissions array', () => {
      class TestController {
        @Permissions()
        testMethod() {}
      }

      const metadata = reflector.get(
        PERMISSIONS_KEY,
        TestController.prototype.testMethod,
      );
      expect(metadata).toEqual([]);
    });

    it('should work on class level', () => {
      @Permissions(Permission.ManageUsers)
      class TestController {
        testMethod() {}
      }

      const metadata = reflector.get(PERMISSIONS_KEY, TestController);
      expect(metadata).toEqual([Permission.ManageUsers]);
    });

    it('should work with all permission types', () => {
      class TestController {
        @Permissions(
          Permission.CreateReportFound,
          Permission.ViewOwnReports,
          Permission.ViewAllReports,
          Permission.UpdateOwnReport,
          Permission.UpdateAnyReport,
          Permission.UpdateReportStatus,
          Permission.DeleteOwnReport,
          Permission.DeleteAnyReport,
          Permission.CreateClaim,
          Permission.ViewClaims,
          Permission.VerifyClaim,
          Permission.ManageOwnAccount,
          Permission.ManageUsers,
          Permission.ManageOfficers,
          Permission.ViewDashboard,
          Permission.ManageCategories,
          Permission.ExportReports,
        )
        testMethod() {}
      }

      const metadata = reflector.get(
        PERMISSIONS_KEY,
        TestController.prototype.testMethod,
      );
      expect(metadata).toHaveLength(17);
      expect(metadata).toContain(Permission.CreateReportFound);
      expect(metadata).toContain(Permission.ExportReports);
    });
  });
});
