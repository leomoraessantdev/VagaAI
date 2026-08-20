import { Router, Request, Response } from 'express';
import { listAreasPublicas } from '../data/areas';
import { LIMITES } from '../lib/schema';
import {
  AFIRMATIVAS,
  BENEFICIOS,
  CONTRATOS,
  JORNADAS,
  MODALIDADES,
  PERIODOS_SALARIO,
  PLATAFORMAS,
  TONS,
  UFS,
} from '../data/catalogos';

const router = Router();

/**
 * Registry que a UI consome para se montar sozinha: áreas (sem `promptGuidance`),
 * catálogos de opções comuns e limites de caracteres. Enquanto o front ler daqui,
 * adicionar uma área nova é criar um arquivo em `src/data/areas/` e mais nada.
 */
router.get('/areas', (_req: Request, res: Response) => {
  // Conteúdo só muda em deploy; cache curto no browser, longo na borda.
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=86400');
  res.json({
    areas: listAreasPublicas(),
    catalogos: {
      modalidades: MODALIDADES,
      contratos: CONTRATOS,
      jornadas: JORNADAS,
      beneficios: BENEFICIOS,
      afirmativas: AFIRMATIVAS,
      tons: TONS,
      periodosSalario: PERIODOS_SALARIO,
      plataformas: PLATAFORMAS,
      ufs: UFS,
    },
    limites: LIMITES,
  });
});

export default router;