import { Test, TestingModule } from '@nestjs/testing';
import { CryptocompareController } from './cryptocompare.controller';
import { CryptocompareService } from './cryptocompare.service';

describe('CryptocompareController', () => {
  let controller: CryptocompareController;

  const mockCryptocompareService = {
    getCryptoPrice: jest.fn().mockResolvedValue({ USD: 1800.12 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptocompareController],
      providers: [
        {
          provide: CryptocompareService,
          useValue: mockCryptocompareService, // Mock CryptocompareService
        },
      ],
    }).compile();

    controller = module.get<CryptocompareController>(CryptocompareController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('/crypto/price (GET)', async () => {
    const result = await controller.getPrice('ETH', 'USD');
    expect(result).toEqual({ USD: 1800.12 });
    expect(mockCryptocompareService.getCryptoPrice).toHaveBeenCalledWith(
      'ETH',
      'USD',
    );
  });
});
