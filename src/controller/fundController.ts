import { Request, Response, NextFunction } from 'express';
import { transferSchema, withdrawalSchema, options } from '../utility/utils';
import bcrypt from 'bcryptjs';
import { knex } from '../db/knex';
import { v4 as uuidv4 } from 'uuid';

const Flutterwave = require('flutterwave-node-v3');


export async function fundAccount(req: Request, res: Response) {
  try {
    if (req.query.status === 'successful') {
      const deposit = await knex('deposits').where('reference', req.query.tx_ref).first();
      const user = await knex('users').where('id', deposit.user_id).first();
      const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
      const response = await flw.Transaction.verify({ id: req.query.transaction_id });

      if (response.data.status === "successful"
        && response.data.amount === deposit.amount
        && response.data.currency === "NGN") {

        await knex('deposits').where('reference', req.query.tx_ref).update({ status: 'successful' });
        await knex('users').where('id', deposit.user_id).update({ wallet: user.wallet + Number(deposit.amount) });

        return res.status(200).json({ msg: "Deposit Successful" });
      } else {
        await knex('deposits').where('reference', req.query.tx_ref).update({ status: 'failed' });
        return res.status(502).json({ msg: "Deposit Failed" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'failed to initiate transaction', route: '/funds/deposit' });
  }
};


//User to User Fund Transfer
export async function transferFund(req: Request, res: Response) {
  try {
    const validationResult = transferSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ msg: validationResult.error.details[0].message });
    }

    const { amount, email, password } = req.body;
    const id = req.user;
    const user = await knex('users').where('id', id).first();

    const recipient = await knex('users').where('email', email).first();
    if (!recipient) { return res.status(404).json({ msg: "Recipient not found" }) };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { return res.status(400).json({ msg: 'Invalid credentials' }) };

    if (user.wallet < amount) {
      return res.status(400).json({ msg: 'Insufficient Balance' });
    }

    await knex('users').where('id', id).update({ wallet: user.wallet - amount });
    await knex('users').where('id', recipient.id).update({ wallet: recipient.wallet + amount });

    await knex('transfers').insert({
      reference: uuidv4(),
      amount: amount,
      recipient_id: recipient.id,
      recipient_email: recipient.email,
      recipient_phone: recipient.phonenumber,
      status: 'sent',
      user_id: id
    });
    return res.status(200).json({ msg: 'Transfer Successful' });

  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'failed to transfer funds', route: '/funds/transfer' });
  }
};


//User Withdrawal
export async function withdrawal(req: Request, res: Response) {
  try {
    const validationResult = withdrawalSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ msg: validationResult.error.details[0].message });
    }

    const user = await knex('users').where('id', req.user).first();
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(401).json({ msg: "Password should match 'password' on login" });
    }

    const wallet = user.wallet;
    const { account_number, amount, code } = req.body;

    if (wallet < amount) {
      return res.status(400).json({ msg: 'Insufficient funds' });
    }

    const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
    const details = {
      account_bank: code,
      account_number: account_number,
      amount: amount,
      currency: "NGN",
      narration: "Airtime Transfer",
      reference: `${uuidv4()}_PMCK`,
      callback_url: `${process.env.ROOT_URL}/users/withdrawal`,
    };

    const payment = await flw.Transfer.initiate(details).then((data: any) => { return data }).catch(console.log);

    if (payment.status === 'error') {
      return res.status(400).json({ msg: payment.message });
    } else {
      await knex('withdrawals').insert({
        reference: payment.data.id,
        code: payment.data.bank_code,
        bank: payment.data.bank_name,
        name: payment.data.full_name,
        account_number: payment.data.account_number,
        amount: payment.data.amount,
        status: payment.data.status,
        user: user.id
      });
      return res.status(200).json({ msg: payment.message });
    }

  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Withdrawal failed', route: '/funds/pay' });
  }
};


