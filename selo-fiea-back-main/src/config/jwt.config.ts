import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (): JwtModuleOptions => ({
  secret: process.env.JWT_SECRET || 'seu-secret-key-muito-seguro-aqui',
  signOptions: {
    expiresIn: '24h',
  },
});