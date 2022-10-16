import { createAccount, logIntoAccount } from '../controller/userController';
import express from 'express';
const router = express.Router();

/* User Routes */
router.post('/create', createAccount);
router.post('/login', logIntoAccount);

export default router;
