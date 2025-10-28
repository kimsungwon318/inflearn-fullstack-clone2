import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string;
  email?: string;
  name?: string;
  id?: string;
  iat?: number;
  exp?: number;
  jti?: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    console.log('JWT Payload:', payload);
    // payload를 그대로 반환하면 req.user에 할당됩니다
    return payload;
  }
}
