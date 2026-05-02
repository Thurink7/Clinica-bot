import { AuthService } from '../services/authService.js';

const service = new AuthService();

export async function postLogin(req, res, next) {
  try {
    const out = await service.login(req.body?.email, req.body?.password);
    res.json(out);
  } catch (e) {
    next(e);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await service.userFromBearer(req.headers.authorization);
    if (!user) {
      const err = new Error('Sessão inválida ou expirada');
      err.status = 401;
      throw err;
    }
    res.json({ user });
  } catch (e) {
    next(e);
  }
}
