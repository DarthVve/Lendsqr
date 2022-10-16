import { Request, Response } from 'express';
import axios from 'axios';

export const cachedBAnks: any[] = [];

export async function getBanks(req: Request, res: Response) {
  try {
    const /* { status, data } */ response = await axios.get("https://api.paystack.co/bank?country=nigeria", {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch list of banks from flutterwave's api" })
  }
};
