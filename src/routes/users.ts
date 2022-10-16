import { createAccount } from '../controller/userController';
import express from 'express';
const router = express.Router();

/* User Routes */
router.post('/create', createAccount);

export default router;
