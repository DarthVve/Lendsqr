import { fundAccount, transferFund, withdrawal } from '../controller/fundController';
import { auth } from '../middleware/auth';
import express from 'express';
const router = express.Router();

/* Fund Routes */
router.get('/deposit', fundAccount);
router.patch('/transfer', auth, transferFund);
router.post('/pay', auth, withdrawal);

export default router;
