import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with jwt strategy', () => {
    expect(guard).toBeInstanceOf(AuthGuard('jwt'));
  });

  it('should be an instance of JwtAuthGuard', () => {
    expect(guard).toBeInstanceOf(JwtAuthGuard);
  });

  it('should have canActivate method', () => {
    expect(typeof guard.canActivate).toBe('function');
  });
});
