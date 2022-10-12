import { Request, Response, NextFunction } from 'express';
import { userSchema, generateToken, options } from '../utility/utils';
import bcrypt from 'bcryptjs';
import { knex } from '../db/knex';

//User Sign up
export async function registerUser(req: Request, res: Response) {
  try {
    const validationResult = userSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({ msg: validationResult.error.details[0].message });
    }

    const duplicate = await knex('users').where('email', req.body.email).first();

    if (duplicate) {
      return res.status(409).json({ msg: 'Enter a unique username, email, or phonenumber' });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 8);
    const user = await knex('users').insert({
      fullname: req.body.fullname,
      username: req.body.username,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      wallet: 0,
      password: passwordHash,
    });

    if (user) {
      return res.status(201).json({
        msg: `User created successfully, welcome ${req.body.username}`,
      });
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'failed to register', route: '/user/register' });
  }
};
