import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { NonceGuard } from '../security/nonce/nonce.guard';
import { ExecutionContext } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/PrismaService';

describe('WalletController', () => {
  let controller: WalletController;
  let guard: NonceGuard;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [WalletController],
      providers: [
        WalletService,
        PrismaService,
        ConfigService,
        {
          provide: NonceGuard,
          useValue: {
            canActivate: jest.fn(async (context: ExecutionContext) => {
              const request = {
                headers: {
                  'x-nonce': 'test-nonce',
                },
              };
              context.switchToHttp = jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue(request),
              });
              return true;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<WalletController>(WalletController);
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

  it('should apply NonceGuard to POST /wallet/', async () => {
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
