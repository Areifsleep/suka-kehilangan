import { AuthGuard } from '@nestjs/passport';
import { RefreshJwtAuthGuard } from './refresh-jwt-auth.guard';

describe('RefreshJwtAuthGuard', () => {
  let guard: RefreshJwtAuthGuard;

  beforeEach(() => {
    guard = new RefreshJwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with refresh-jwt strategy', () => {
    expect(guard).toBeInstanceOf(AuthGuard('refresh-jwt'));
  });

  it('should be an instance of RefreshJwtAuthGuard', () => {
    expect(guard).toBeInstanceOf(RefreshJwtAuthGuard);
  });

  it('should have canActivate method', () => {
    expect(typeof guard.canActivate).toBe('function');
  });
});
