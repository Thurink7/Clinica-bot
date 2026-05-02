import bcrypt from 'bcryptjs';
import { AdminUserRepository } from './repositories/adminUserRepository.js';
import { logger } from './utils/logger.js';

/**
 * Cria o primeiro usuário admin se ADMIN_BOOTSTRAP_EMAIL / ADMIN_BOOTSTRAP_PASSWORD
 * estiverem definidos e a coleção ainda não tiver esse e-mail.
 */
export async function ensureBootstrapAdmin() {
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (!email || !password) return;

  const repo = new AdminUserRepository();
  const existing = await repo.findByEmail(email);
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 12);
  await repo.create({
    email,
    passwordHash,
    nome: process.env.ADMIN_BOOTSTRAP_NOME || 'Administrador',
  });
  logger.info('bootstrap_admin_created', { email });
}
