import { Request, Response, NextFunction } from 'express';
import { options, depositSchema, moneyConverter } from '../utility/utils';
import bcrypt from 'bcryptjs';
import { knex } from '../db/knex';
import axios from 'axios';
import { getBanks } from '../utility/paystack';

export async function fundAccount(req: Request, res: Response) {
  try {
    const validationResult = depositSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.details[0].message });
    }

    await getBanks(req, res);
    const { email, amount, account_number, code, phone_number } = req.body;

    const funding = await axios.post('https://api.paystack.co/charge', {
      email: email,
      amount: moneyConverter(amount),
      bank: {
        code: code,
        account_number: account_number
      }
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-type": "application/json"
      }
    });

    //const user = await knex
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'failed to initiate transaction', route: '/funds/deposit' });
  }
};
