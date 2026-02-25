import { Controller, Post, Get, UseGuards, Request, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

/**
 * Controller de autenticação.
 * Expõe endpoints de login (retorna JWT) e consulta de filiais do usuário autenticado.
 */
@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint de login.
   * Recebe nomeUsuario e senha no body, valida via LocalStrategy,
   * e retorna um token JWT junto com os dados básicos do usuário.
   */
  @ApiOperation({ summary: 'Realizar login com nome de usuário e senha' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso. Retorna o token JWT.',
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any, @Body() _loginDto: LoginDto) {
    const usuario = req.user;
    const accessToken = await this.authService.gerarToken(usuario);

    return {
      accessToken,
      usuario: {
        id: usuario.id,
        nomeUsuario: usuario.nomeUsuario,
        nome: usuario.nome,
        filialPrincipal: {
          id: usuario.filialPrincipal.id,
          nome: usuario.filialPrincipal.nome,
        },
      },
    };
  }

  /**
   * Retorna a lista de filiais que o usuário autenticado tem permissão para acessar.
   * Inclui a filial principal e todas as filiais permitidas explicitamente.
   * Requer token JWT no header Authorization.
   */
  @ApiOperation({
    summary: 'Listar filiais autorizadas do usuário autenticado',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Lista de filiais autorizadas retornada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  @UseGuards(JwtAuthGuard)
  @Get('filiais')
  async listarFiliais(@Request() req: any) {
    const filiais = await this.authService.buscarFiliaisDoUsuario(req.user.id);

    return {
      usuario: {
        id: req.user.id,
        nomeUsuario: req.user.nomeUsuario,
      },
      filiais: filiais.map((filial) => ({
        id: filial.id,
        nome: filial.nome,
        cnpj: filial.cnpj,
        ativo: filial.ativo,
      })),
    };
  }
}
