import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './auth.service';

/**
 * Estratégia JWT via Passport.
 * Extrai o token do header Authorization (Bearer) e valida.
 * Injeta o payload decodificado no req.user.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /**
   * Método chamado após a validação do token.
   * O retorno é injetado em req.user.
   */
  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      nomeUsuario: payload.nomeUsuario,
      filialPrincipalId: payload.filialPrincipalId,
    };
  }
}
