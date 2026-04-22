import { ProfessionalRepository } from '../repositories/professionalRepository.js';

export class ProfessionalService {
  constructor(repo = new ProfessionalRepository()) {
    this.repo = repo;
  }

  async cadastrar({ nome, servicos, ativo } = {}) {
    const n = String(nome || '').trim();
    if (!n) {
      const err = new Error('nome obrigatório');
      err.status = 400;
      throw err;
    }

    const list = Array.isArray(servicos)
      ? servicos
      : String(servicos || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

    if (!list.length) {
      const err = new Error('servicos obrigatório (array ou string separada por vírgula)');
      err.status = 400;
      throw err;
    }

    const norm = [...new Set(list.map((s) => s.toUpperCase()))];
    return this.repo.create({ nome: n, servicos: norm, ativo: ativo !== false });
  }

  async listarAtivos() {
    return this.repo.listActive();
  }

  async listarServicos() {
    const pros = await this.repo.listActive();
    const set = new Set();
    for (const p of pros) {
      (p.servicos || []).forEach((s) => set.add(String(s).toUpperCase()));
    }
    return [...set.values()].sort();
  }

  async profissionaisPorServico(servico) {
    const s = String(servico || '').trim().toUpperCase();
    if (!s) return [];
    const pros = await this.repo.listActive();
    return pros.filter((p) => (p.servicos || []).map(String).map((x) => x.toUpperCase()).includes(s));
  }
}

