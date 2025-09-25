import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserModule', () => {
  let module: TestingModule;
  let userService: UserService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have UserService', () => {
    expect(userService).toBeDefined();
    expect(userService).toBeInstanceOf(UserService);
  });

  it('should compile the module', () => {
    expect(module).toBeTruthy();
  });
});
