import express from 'express';

//Importar todas as rotas 
import authRouter from './auth.routes.js';
import animesRouter from './animeRoutes.js';
import collectionRouter from './collectionRoutes.js';
import cardRouter from './cardRoutes.js';
import personagensRouter from './personagemRoutes.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

//Rotas públicas
router.use(authMiddleware)

router.use('/animes', animesRouter);
router.use('/collections', collectionRouter);
router.use('/cards', cardRouter);
router.use('/personagens', personagensRouter);


export default router;