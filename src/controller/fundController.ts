import { Request, Response, NextFunction } from 'express';
import { userSchema, loginSchema, generateToken, options } from '../utility/utils';
import bcrypt from 'bcryptjs';
import { knex } from '../db/knex';

export async function fundAccount(req: Request, res: Response) {
  try { } catch (err) { }
};
