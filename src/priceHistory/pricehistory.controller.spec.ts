import { Test, TestingModule } from '@nestjs/testing';
import { PricehistoryController } from './pricehistory.controller';

describe('PricehistoryController', () => {
  let controller: PricehistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricehistoryController],
    }).compile();

    controller = module.get<PricehistoryController>(PricehistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
