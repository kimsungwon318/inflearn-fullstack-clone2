import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies/access-token.strategy';

@Module({
  imports: [PassportModule, JwtModule],
  providers: [AccessTokenStrategy],
  exports: [AccessTokenStrategy],
})
export class AuthModule {}
