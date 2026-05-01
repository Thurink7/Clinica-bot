import { ProfessionalRepository } from '../repositories/professionalRepository.js';

export class ProfessionalService {
  constructor(repo = new ProfessionalRepository()) {
    this.repo = repo;
  }

  async cadastrar({ nome, especialidade, telefone, email, servicos, ativo } = {}) {
    const n = String(nome || '').trim();
    const esp = String(especialidade || '').trim();
    const tel = String(telefone || '').replace(/\D/g, '');
    const em = String(email || '').trim().toLowerCase();

    if (!n) {
      const err = new Error('nome obrigatório');
      err.status = 400;
      throw err;
    }
    if (!esp) {
      const err = new Error('especialidade obrigatória');
      err.status = 400;
      throw err;
    }
    if (!tel || tel.length < 10) {
      const err = new Error('telefone obrigatório (mín. 10 dígitos)');
      err.status = 400;
      throw err;
    }
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      const err = new Error('email obrigatório inválido');
      err.status = 400;
      throw err;
    }

    let list = Array.isArray(servicos)
      ? servicos
      : String(servicos || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

    if (!list.length) list = [esp];

    const norm = [...new Set(list.map((s) => String(s).toUpperCase()))];
    return this.repo.create({
      nome: n,
      especialidade: esp,
      telefone: tel,
      email: em,
      servicos: norm,
      ativo: ativo !== false,
    });
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

