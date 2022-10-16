import { Request, Response, NextFunction } from 'express';
import { userSchema, loginSchema, generateToken, options } from '../utility/utils';
import bcrypt from 'bcryptjs';
import { knex } from '../db/knex';

//User Sign up
export async function createAccount(req: Request, res: Response) {
  try {
    const validationResult = userSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({ msg: validationResult.error.details[0].message });
    }

    const duplicateUser = await knex('users').where('email', req.body.email).orWhere('username', req.body.username).orWhere('phonenumber', req.body.phonenumber).first();

    if (duplicateUser) {
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
        msg: `User account created successfully, welcome ${req.body.username}`,
      });
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'failed to create an account', route: '/users/create' });
  }
};

//User Log In
export async function logIntoAccount(req: Request, res: Response) {
  try {
    const validationResult = loginSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ msg: validationResult.error.details[0].message });
    }

    const user = await knex('users').where('email', req.body.emailOrUsername).orWhere('username', req.body.emailOrUsername).first();

    if (!user) { return res.status(404).json({ msg: 'User not found' }) };

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      const id = user.id;
      const fullname = user.fullname;
      const username = user.username;
      const email = user.email;
      const phonenumber = user.phonenumber;
      const wallet = user.wallet;
      const userInfo = { id, fullname, username, email, phonenumber, wallet };
      const token = generateToken({ id }) as string;
      const production = process.env.NODE_ENV === "production";

      return res.status(200).cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: production,
        sameSite: production ? "none" : "lax"
      }).json({
        msg: 'You have successfully logged in',
        userInfo
      });
    } else {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'failed to authenticate', route: '/users/login' });
  }
};
