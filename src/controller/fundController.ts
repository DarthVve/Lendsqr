import { Request, Response, NextFunction } from 'express';
import { userSchema, loginSchema, generateToken, options } from '../utility/utils';
import bcrypt from 'bcryptjs';
import { knex } from '../db/knex';
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

export async function fundAccount(req: Request, res: Response) {
  try {
    if (req.query.status === 'successful') {
      //const transactionDetails = await Transaction.find({ ref: req.query.tx_ref });
      const response = await flw.Transaction.verify({ id: req.query.transaction_id });
      if (
        response.data.status === "successful"
        //&& response.data.amount === transactionDetails.amount
        && response.data.currency === "NGN") {
        // Success! Confirm the customer's payment
        return res.status
      } else {
        // Inform the customer their payment was unsuccessful
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'failed to initiate transaction', route: '/funds/deposit' });
  }
};
