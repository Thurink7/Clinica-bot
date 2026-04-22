import { ProfessionalService } from '../services/professionalService.js';

const service = new ProfessionalService();

export async function postProfissional(req, res, next) {
  try {
    const out = await service.cadastrar(req.body || {});
    res.status(201).json(out);
  } catch (e) {
    next(e);
  }
}

export async function getProfissionais(req, res, next) {
  try {
    const list = await service.listarAtivos();
    res.json(list);
  } catch (e) {
    next(e);
  }
}

export async function getServicos(req, res, next) {
  try {
    const list = await service.listarServicos();
    res.json(list);
  } catch (e) {
    next(e);
  }
}

