import { Reflector } from '@nestjs/core';
import { Roles, ROLES_KEY } from './roles.decorator';
import { Role } from '../constants/roles.enum';

describe('Roles Decorator', () => {
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
  });

  it('should set roles metadata', () => {
    class TestController {
      @Roles(Role.ADMIN, Role.PETUGAS)
      testMethod() {
        return 'test';
      }
    }

    const roles = reflector.get<Role[]>(
      ROLES_KEY,
      TestController.prototype.testMethod,
    );

    expect(roles).toEqual([Role.ADMIN, Role.PETUGAS]);
  });

  it('should handle single role', () => {
    class TestController {
      @Roles(Role.USER)
      testMethod() {
        return 'test';
      }
    }

    const roles = reflector.get<Role[]>(
      ROLES_KEY,
      TestController.prototype.testMethod,
    );

    expect(roles).toEqual([Role.USER]);
  });
});
