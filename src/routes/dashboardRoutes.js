import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
// Dashboard data accessible by all roles (VIEWER, ANALYST, ADMIN)
router.get('/summary', requireRole(['ADMIN', 'ANALYST', 'VIEWER']), dashboardController.getSummary);

export default router;
