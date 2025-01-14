import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CryptocompareService } from './cryptocompare.service';

describe('CryptocompareService', () => {
  let service: CryptocompareService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()], // Importez ConfigModule pour injecter ConfigService
      providers: [CryptocompareService],
    }).compile();

    service = module.get<CryptocompareService>(CryptocompareService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch crypto price', async () => {
    // Vous pouvez mocker la méthode si vous ne voulez pas faire une vraie requête
    jest.spyOn(service, 'getCryptoPrice').mockResolvedValue({ USD: 1800.12 });

    const result = await service.getCryptoPrice('ETH', 'USD');
    expect(result).toEqual({ USD: 1800.12 });
  });
});
