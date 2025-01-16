import { Test, TestingModule } from '@nestjs/testing';
import { PricehistoryService } from './pricehistory.service';

describe('PricehistoryService', () => {
  let service: PricehistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PricehistoryService],
    }).compile();

    service = module.get<PricehistoryService>(PricehistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
