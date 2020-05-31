import path from 'path';
import express from 'express';
import {
  galleryImageRouter,
  artistRouter,
  guitarSeriesRouter,
  guitarRouter,
  guitarColorRouter,
  authRouter,
  pageMetadataRouter,
} from './routers';
import authMiddleware from '../../middleware/auth';
import sideEffectMiddleware from '../../middleware/sideEffect';
import { errorHandlingMiddleware, ERROR_HANDLING_TYPE } from '../../middleware/errorHandling';

const router = express.Router();

router.use('/', authRouter);
router.use(authMiddleware);
router.use(sideEffectMiddleware);
router.use('/', artistRouter);
router.use('/', galleryImageRouter);
router.use('/', guitarSeriesRouter);
router.use('/', guitarRouter);
router.use('/', guitarColorRouter);
router.use('/', pageMetadataRouter);
router.use(errorHandlingMiddleware(ERROR_HANDLING_TYPE.ADMIN));

const ADMIN_INTERFACE_BUILD = path.join(__dirname, '..', 'admin-interface', 'build');
// For everything else, serve index file
router.get('*', (req, res) => res.sendFile(path.join(ADMIN_INTERFACE_BUILD, 'index.html')));

export default router;