import { createSession } from './generate-session';

// Mock crypto module
jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
}));

describe('generateSession', () => {
  const mockRandomBytes = require('crypto').randomBytes;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(createSession).toBeDefined();
  });

  it('should generate a session ID using randomBytes', () => {
    const mockBuffer = Buffer.from('12345678901234567890123456789012', 'hex');
    mockRandomBytes.mockReturnValue(mockBuffer);

    const result = createSession();

    expect(result).toBe('12345678901234567890123456789012');
    expect(mockRandomBytes).toHaveBeenCalledWith(16);
  });

  it('should return a string', () => {
    const mockBuffer = Buffer.from('12345678901234567890123456789012', 'hex');
    mockRandomBytes.mockReturnValue(mockBuffer);

    const result = createSession();

    expect(typeof result).toBe('string');
  });

  it('should call randomBytes with 16 bytes', () => {
    const mockBuffer = Buffer.from('12345678901234567890123456789012', 'hex');
    mockRandomBytes.mockReturnValue(mockBuffer);

    createSession();

    expect(mockRandomBytes).toHaveBeenCalledWith(16);
  });

  it('should return hex string of correct length', () => {
    const mockBuffer = Buffer.from('12345678901234567890123456789012', 'hex');
    mockRandomBytes.mockReturnValue(mockBuffer);

    const result = createSession();

    expect(result).toHaveLength(32); // 16 bytes = 32 hex characters
    expect(/^[0-9a-f]+$/i.test(result)).toBe(true);
  });
});
