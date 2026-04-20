import { ConsultaService } from '../services/consultaService.js';
import { ConfigRepository } from '../repositories/configRepository.js';
import { ConsultaRepository } from '../repositories/consultaRepository.js';

const service = new ConsultaService();
const consultaRepo = new ConsultaRepository();

export async function postAgendar(req, res, next) {
  try {
    const out = await service.agendar(req.body);
    res.status(201).json(out);
  } catch (e) {
    next(e);
  }
}

export async function getConsultas(req, res, next) {
  try {
    const { data, de, ate } = req.query;
    const list = await service.listar({ data, de, ate });
    res.json(list);
  } catch (e) {
    next(e);
  }
}

export async function putCancelar(req, res, next) {
  try {
    const id = req.body?.id || req.query?.id;
    const out = await service.cancelar(id);
    res.json(out);
  } catch (e) {
    next(e);
  }
}

export async function patchStatus(req, res, next) {
  try {
    const { id, status } = req.body;
    const out = await service.atualizarStatus(id, status);
    res.json(out);
  } catch (e) {
    next(e);
  }
}

export async function deleteConsulta(req, res, next) {
  try {
    const id = req.params?.id || req.body?.id || req.query?.id;
    const out = await service.excluir(id);
    res.json(out);
  } catch (e) {
    next(e);
  }
}

export async function getSlots(req, res, next) {
  try {
    const { data } = req.query;
    if (!data) {
      const err = new Error('Query data (YYYY-MM-DD) obrigatória');
      err.status = 400;
      throw err;
    }
    const livres = await service.horariosDisponiveis(data);
    res.json({ data, horarios: livres });
  } catch (e) {
    next(e);
  }
}

const configRepo = new ConfigRepository();

export async function getConfig(req, res, next) {
  try {
    const cfg = await configRepo.get();
    res.json(cfg);
  } catch (e) {
    next(e);
  }
}

export async function putConfig(req, res, next) {
  try {
    const cfg = await configRepo.update(req.body);
    res.json(cfg);
  } catch (e) {
    next(e);
  }
}

export async function getPacientes(req, res, next) {
  try {
    const list = await consultaRepo.listPacientesAggregated();
    res.json(list);
  } catch (e) {
    next(e);
  }
}
