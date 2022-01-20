import express from 'express';
import { body } from 'express-validator';
import * as userController from '../controller/user.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

const validate = [
	body('username').trim().notEmpty(),
	body('password').trim().isLength({ min: 5 }),
];

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', isAuth, userController.logout);
router.patch('/update', userController.update);
router.delete('/remove', isAuth, userController.remove);
router.get('/me', isAuth, userController.me);
router.get('/nickCheck', userController.nickCheck);
router.get('/userCheck', userController.userCheck);
router.get('/profile', userController.getProfile);

export default router;
