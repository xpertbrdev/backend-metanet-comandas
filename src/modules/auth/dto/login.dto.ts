import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para o endpoint de login.
 */
export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Nome de usuário' })
  nomeUsuario: string;

  @ApiProperty({ example: 'Admin@123', description: 'Senha do usuário' })
  senha: string;
}
