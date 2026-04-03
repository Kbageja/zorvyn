import express from 'express';
import * as authController from '../controllers/authController.js';
import validate from '../middlewares/validateRequest.js';
import { register, login } from '../validations/auth.validation.js';

const router = express.Router();

router.post('/register', validate(register), authController.register);
router.post('/login', validate(login), authController.login);

export default router;
