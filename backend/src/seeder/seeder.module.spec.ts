import { Test, TestingModule } from '@nestjs/testing';
import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';

describe('SeederModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [SeederModule],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have SeederService', () => {
    const service = module.get<SeederService>(SeederService);
    expect(service).toBeDefined();
  });
});
