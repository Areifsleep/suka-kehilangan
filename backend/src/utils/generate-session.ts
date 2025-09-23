import { randomBytes } from 'crypto';

export function createSession(): string {
  const sessionId = randomBytes(16).toString('hex');
  return sessionId;
}
