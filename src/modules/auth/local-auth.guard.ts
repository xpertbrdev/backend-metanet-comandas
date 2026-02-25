import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard de autenticação local.
 * Utiliza a estratégia 'local' do Passport para proteger endpoints.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
