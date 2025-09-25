import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be created successfully', () => {
    expect(service).toBeTruthy();
    expect(service.constructor.name).toBe('PrismaService');
  });

  it('should have onModuleInit method', () => {
    expect(typeof service.onModuleInit).toBe('function');
  });

  describe('onModuleInit', () => {
    it('should call $connect', async () => {
      const connectSpy = jest.spyOn(service, '$connect').mockResolvedValue();
      await service.onModuleInit();
      expect(connectSpy).toHaveBeenCalled();
      connectSpy.mockRestore();
    });
  });
});
