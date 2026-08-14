import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: 'user-1',
    name: 'Dexter',
    email: 'dexter@gmail.com',
    username: 'Dexuser',
    title: 'Designer',
    avatar: 'avatar.png',
    role: 'Designer',
    userType: 'guest',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockResolvedValue(mockUser),
              create: jest.fn().mockResolvedValue(mockUser),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should execute guest login and return user + token', async () => {
    const result = await service.guestLogin({});
    expect(result.token).toEqual('mock-jwt-token');
    expect(result.user.email).toEqual('dexter@gmail.com');
  });
});
