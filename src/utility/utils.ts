import Joi from 'joi';
import jwt from 'jsonwebtoken';

//Joi validation options
export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: '',
    },
  },
};


//User Sign up schema
export const userSchema = Joi.object().keys({
  fullname: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().trim().lowercase().required(),
  phonenumber: Joi.string().regex(/^[0-9]{11}$/).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  confirm_password: Joi.ref('password')
}).with('password', 'confirm_password');

//User Log In Schema
export const loginSchema = Joi.object().keys({
  emailOrUsername: Joi.string().trim().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
});


//Fund User Account Schema
export const fundSchema = Joi.object().keys({
  amount: Joi.number().required(),
});


//Fund Transfer Schema
export const transferSchema = Joi.object().keys({
  amount: Joi.number().required(),
  email: Joi.string().trim().lowercase().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
});


//Withdrawal schema
export const withdrawalSchema = Joi.object().keys({
  account_number: Joi.string().length(10),
  code: Joi.string(),
  amount: Joi.string().required().regex(/^[0-9]{3,6}$/),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
});

//Token Generator function for login sessions
export const generateToken = (user: { [key: string]: unknown }, time: string = '7d'): unknown => {
  const pass = process.env.JWT_SECRET as string;
  return jwt.sign(user, pass, { expiresIn: time });
};
