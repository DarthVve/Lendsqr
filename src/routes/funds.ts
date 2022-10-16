import { fundAccount } from '../controller/fundController';
import express from 'express';
const router = express.Router();

/* Fund Routes */
router.get('/deposit', fundAccount);

export default router;
