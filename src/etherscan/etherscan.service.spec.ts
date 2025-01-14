import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { EtherscanService } from './etherscan.service';

describe('EtherscanService', () => {
  let service: EtherscanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [EtherscanService],
    }).compile();

    service = module.get<EtherscanService>(EtherscanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch transactions', async () => {
    const result = await service.getTransactions(
      '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
    );
    expect(result).toHaveProperty('status');
  });
});
