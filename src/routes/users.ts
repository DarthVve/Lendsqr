import { registerUser } from '../controller/userController';
import express from 'express';
const router = express.Router();

/* GET users listing. */
router.post('/create', registerUser);

export default router;
