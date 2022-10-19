import { createAccount, logIntoAccount, paymentLink, debitWallet, logoutUser } from '../controller/userController';
import { auth } from '../middleware/auth';
import express from 'express';
const router = express.Router();

/* User Routes */
router.post('/create', createAccount);
router.post('/login', logIntoAccount);
router.post('/fund', auth, paymentLink);
router.get('/withdraw', debitWallet);
router.get('/logout', logoutUser);

export default router;
