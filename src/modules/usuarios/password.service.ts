import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * Serviço responsável por operações de hashing e verificação de senhas.
 * Encapsula a lógica do bcrypt para facilitar manutenção e testes.
 */
@Injectable()
export class PasswordService {
  private readonly SALT_ROUNDS = 12;

  /**
   * Gera o hash de uma senha em texto plano.
   */
  async hash(senha: string): Promise<string> {
    return bcrypt.hash(senha, this.SALT_ROUNDS);
  }

  /**
   * Compara uma senha em texto plano com um hash armazenado.
   * Retorna true se a senha corresponder ao hash.
   */
  async comparar(senha: string, hash: string): Promise<boolean> {
    return bcrypt.compare(senha, hash);
  }
}
