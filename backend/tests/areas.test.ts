import request from 'supertest';
import express from 'express';
import areasRouter from '../src/routes/areas';
import { AREAS, AREA_IDS, getArea, listAreasPublicas } from '../src/data/areas';

const app = express();
app.use('/api', areasRouter);

function duplicados(ids: string[]): string[] {
  return ids.filter((id, i) => ids.indexOf(id) !== i);
}

describe('invariantes do registry', () => {
  it.each(AREA_IDS)('área "%s" está bem formada', (id) => {
    const area = getArea(id);
    expect(area.id).toBe(id);
    expect(area.label.length).toBeGreaterThan(0);
    expect(area.icon.length).toBeGreaterThan(0);
    expect(area.descricao.length).toBeGreaterThan(0);
    expect(area.skillLabel.length).toBeGreaterThan(0);
    expect(area.skillPlaceholder.length).toBeGreaterThan(0);
    // Orientação curta demais não muda o vocabulário da descrição gerada.
    expect(area.promptGuidance.length).toBeGreaterThan(200);
  });

  it.each(AREA_IDS)('área "%s" tem escala de senioridade própria e sem repetição', (id) => {
    const niveis = getArea(id).seniorityLevels;
    expect(niveis.length).toBeGreaterThanOrEqual(4);
    expect(duplicados(niveis.map((n) => n.id))).toEqual([]);
    for (const nivel of niveis) {
      expect(nivel.label.length).toBeGreaterThan(0);
    }
  });

  it.each(AREA_IDS)('campos extras de "%s" têm ids e opções únicos', (id) => {
    const campos = getArea(id).extraFields ?? [];
    expect(duplicados(campos.map((c) => c.id))).toEqual([]);
    for (const campo of campos) {
      if (campo.tipo === 'select' || campo.tipo === 'multi') {
        expect(campo.opcoes.length).toBeGreaterThan(1);
        expect(duplicados(campo.opcoes.map((o) => o.id))).toEqual([]);
      }
    }
  });

  it('não reaproveita a escala de TI em logística', () => {
    const ti = getArea('tecnologia').seniorityLevels.map((n) => n.id);
    const logistica = getArea('logistica-operacoes').seniorityLevels.map((n) => n.id);
    expect(logistica).not.toEqual(ti);
    expect(ti).toContain('tech-lead');
    expect(logistica).toContain('encarregado');
    expect(logistica).not.toContain('tech-lead');
  });

  it('mantém "outra área" como último item, para ficar no fim da grade', () => {
    expect(AREA_IDS[AREA_IDS.length - 1]).toBe('outra');
  });


  it('expõe todas as áreas declaradas', () => {
    expect(AREA_IDS).toHaveLength(Object.keys(AREAS).length);
  });
});

describe('recorte público do registry', () => {
  it('não vaza promptGuidance para o browser', () => {
    for (const area of listAreasPublicas()) {
      expect(area).not.toHaveProperty('promptGuidance');
    }
    expect(JSON.stringify(listAreasPublicas())).not.toContain('vocabulário da área de tecnologia');
  });

  it('mantém tudo que a UI precisa para se montar', () => {
    for (const area of listAreasPublicas()) {
      expect(area.seniorityLevels.length).toBeGreaterThan(0);
      expect(typeof area.skillLabel).toBe('string');
      expect(Array.isArray(area.commonRoles)).toBe(true);
    }
  });
});

describe('GET /api/areas', () => {
  it('devolve áreas, catálogos e limites', async () => {
    const res = await request(app).get('/api/areas');
    expect(res.status).toBe(200);
    expect(res.body.areas).toHaveLength(AREA_IDS.length);
    expect(res.body.catalogos.modalidades.map((m: { id: string }) => m.id)).toEqual([
      'presencial',
      'hibrido',
      'remoto',
    ]);
    expect(res.body.catalogos.beneficios.length).toBeGreaterThanOrEqual(10);
    expect(res.body.catalogos.ufs).toContain('SP');
    expect(res.body.limites.cargo).toBe(120);
  });

  it('não expõe promptGuidance na resposta', async () => {
    const res = await request(app).get('/api/areas');
    expect(res.text).not.toContain('promptGuidance');
  });

  it('pode ser cacheado', async () => {
    const res = await request(app).get('/api/areas');
    expect(res.headers['cache-control']).toContain('max-age');
  });
});