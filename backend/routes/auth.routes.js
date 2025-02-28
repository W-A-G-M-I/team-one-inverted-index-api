import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getMe, logout, signIn, signUp } from '../controllers/auth.controllers.js';

const router = express.Router();
router.get('/me', protectRoute,  getMe)
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/logout', logout);

export default router;