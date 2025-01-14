import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { EtherscanController } from './etherscan.controller';
import { EtherscanService } from './etherscan.service';

describe('EtherscanController', () => {
  let controller: EtherscanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [EtherscanController],
      providers: [EtherscanService],
    }).compile();

    controller = module.get<EtherscanController>(EtherscanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return transactions', async () => {
    const result = await controller.getTransactions(
      '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
    );
    expect(result).toHaveProperty('status');
  });
});
