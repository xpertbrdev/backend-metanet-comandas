import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Filial } from '../../../modules/filiais/filial.entity';
import { Usuario } from '../../../modules/usuarios/usuario.entity';
import * as bcrypt from 'bcrypt';

/**
 * Seeder de bootstrap do sistema.
 *
 * Cria a primeira filial ("Matriz") e o primeiro usuário administrador.
 * É idempotente: se já existir alguma filial no banco, não faz nada.
 *
 * As credenciais do admin são lidas das variáveis de ambiente:
 *   - ADMIN_USUARIO (padrão: "admin")
 *   - ADMIN_NOME (padrão: "Administrador")
 *   - ADMIN_EMAIL (padrão: "admin@metanet.com")
 *   - ADMIN_SENHA (padrão: "Admin@123")
 *
 * Uso: yarn seed:run
 */
export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Verificar se já existe alguma filial no banco (idempotência)
    const filialExistente = await em.count(Filial);

    if (filialExistente > 0) {
      console.log(
        '[Seed] Já existem filiais no banco de dados. Seed ignorado.',
      );
      return;
    }

    console.log('[Seed] Nenhuma filial encontrada. Iniciando bootstrap...');

    // Criar a filial Matriz
    const matriz = em.create(Filial, {
      nome: 'Matriz',
      ativo: true,
    });

    // Ler credenciais do admin das variáveis de ambiente
    const adminUsuario = process.env.ADMIN_USUARIO || 'admin';
    const adminNome = process.env.ADMIN_NOME || 'Administrador';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@metanet.com';
    const adminSenha = process.env.ADMIN_SENHA || 'Admin@123';

    // Gerar hash da senha (12 rounds de salt)
    const senhaHash = await bcrypt.hash(adminSenha, 12);

    // Criar o usuário administrador vinculado à Matriz
    const admin = em.create(Usuario, {
      nomeUsuario: adminUsuario,
      nome: adminNome,
      email: adminEmail,
      senha: senhaHash,
      ativo: true,
      filialPrincipal: matriz,
    });

    // Adicionar a Matriz às filiais permitidas do admin
    admin.filiaisPermitidas.add(matriz);

    // Persistir tudo no banco
    await em.flush();

    console.log('[Seed] Bootstrap concluído com sucesso!');
    console.log(`[Seed] Filial criada: "${matriz.nome}" (ID: ${matriz.id})`);
    console.log(
      `[Seed] Admin criado: "${admin.nomeUsuario}" (${admin.nome}) (ID: ${admin.id})`,
    );
  }
}
