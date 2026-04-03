import express from 'express';
import * as userController from '../controllers/userController.js';
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.use(requireRole(['ADMIN']));

router.get('/', userController.getUsers);
router.put('/:id/role', userController.updateUserRole);
router.put('/:id/status', userController.updateUserStatus);

export default router;
