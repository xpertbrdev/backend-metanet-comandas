import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard de autenticação JWT.
 * Protege endpoints que exigem um token JWT válido no header Authorization.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
