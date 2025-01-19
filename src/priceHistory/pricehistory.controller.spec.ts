import { Test, TestingModule } from '@nestjs/testing';
import { PriceHistoryController } from './pricehistory.controller';
import { PriceHistoryService } from './pricehistory.service';
import { NonceGuard } from '../security/nonce/nonce.guard';
import { ExecutionContext } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/PrismaService';
import { CryptocompareService } from '../cryptocompare/cryptocompare.service';

describe('PriceHistoryController', () => {
  let controller: PriceHistoryController;
  let guard: NonceGuard;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [PriceHistoryController],
      providers: [
        PriceHistoryService,
        PrismaService,
        ConfigService,
        CryptocompareService,
        {
          provide: NonceGuard,
          useValue: {
            canActivate: jest.fn(async (context: ExecutionContext) => {
              const request = context.switchToHttp().getRequest();
              const nonce = request.headers['x-nonce'];
              console.log('Nonce:', nonce);

              if (!nonce) {
                console.log('No nonce provided');
                return false;
              }

              const validNonce = await prisma.nonce.findUnique({
                where: { value: nonce },
              });
              console.log('Valid nonce:', validNonce);

              if (!validNonce) {
                console.log('Nonce not found in database');
                return false;
              }

              const nonceAge =
                new Date().getTime() - new Date(validNonce.createdAt).getTime();
              console.log('Nonce age (ms):', nonceAge);

              if (nonceAge > 5 * 60 * 1000) {
                await prisma.nonce.delete({ where: { value: nonce } });
                console.log('Nonce too old, deleted from database');
                return false;
              }

              await prisma.nonce.delete({ where: { value: nonce } });
              console.log('Nonce valid, deleted from database');
              return true;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<PriceHistoryController>(PriceHistoryController);
    guard = module.get<NonceGuard>(NonceGuard);
    prisma = module.get<PrismaService>(PrismaService);

    // Créer le nonce dans la base de données
    await prisma.nonce.create({
      data: {
        value: 'test-nonce',
        createdAt: new Date(),
      },
    });
  });

  afterEach(async () => {
    // Nettoyer la base de données après chaque test
    await prisma.nonce.deleteMany({});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should apply NonceGuard to GET /pricehistory/:symbol', async () => {
    const context: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            'x-nonce': 'test-nonce',
          },
        }),
      }),
    } as unknown as ExecutionContext;

    const canActivate = await guard.canActivate(context); // Utilisez await pour attendre la résolution de la promesse
    console.log('canActivate result:', canActivate);
    expect(canActivate).toBe(true);
  });

  it('should block request with invalid nonce', async () => {
    const context: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            'x-nonce': 'invalid-nonce',
          },
        }),
      }),
    } as unknown as ExecutionContext;

    const canActivate = await guard.canActivate(context); // Utilisez await pour attendre la résolution de la promesse
    console.log('canActivate result with invalid nonce:', canActivate);
    expect(canActivate).toBe(false);
  });
});
