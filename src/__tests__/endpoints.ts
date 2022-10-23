import express from 'express';
import request from 'supertest';
import userRouter from '../routes/users';
// import { knex } from '../db/knex';
import cookieParser from 'cookie-parser';

let cookie: string;
let id: string;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/user', userRouter);

//Tests user sign-up
describe('User Sign-up API Integration test', () => {
  test('POST /user/register - success - sign-up a user', async () => {
    const { body, statusCode } = await request(app).post('/user/register').send({
      fullname: "John Doe",
      username: "jasydizzy",
      email: "jds@example.com",
      phonenumber: "08020000045",
      password: "test",
      confirm_password: "test"
    })

    expect(statusCode).toBe(201);
    expect(body.msg).toContain('User created successfully');
  });

  test('POST /user/register - failure - request body invalid', async () => {
    const { body, statusCode } = await request(app).post('/user/register').send({
      fullname: "John Doe",
      username: null,
      email: "jd@gmail.com",
      phonenumber: null,
      password: "test",
      confirm_password: "test"
    })

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('msg');
  });

  test('POST /user/register - failure - User already exists', async () => {
    const { body, statusCode } = await request(app).post('/user/register').send({
      fullname: "John Doe",
      username: "jasydizzy",
      email: "jds@example.com",
      phonenumber: "08023780045",
      password: "test",
      confirm_password: "test"
    })

    expect(statusCode).toBe(409);
    expect(body).toHaveProperty('msg');
  });
});

//Tests user login
describe('User Login API Integration test', () => {
  // beforeAll(async () => {
  //   await request(app).post('/user/register').send({
  //     fullname: "John Doe",
  //     username: "jasydizzy",
  //     email: "jds@example.com",
  //     phonenumber: "08023780045",
  //     password: "test",
  //     confirm_password: "test"
  //   })

  //   await knex.query('UPDATE users SET verified = true WHERE email = "jds@example.com";')
  // })

  test('POST /user/login - success - login a user with email', async () => {
    const { body, statusCode } = await request(app).post('/user/login').send({
      emailOrUsername: "jds@example.com",
      password: "test",
    })

    expect(statusCode).toBe(200);
    expect(body.msg).toBe('You have successfully logged in');
    expect(body).toHaveProperty('userInfo');
  });

  test('POST /user/login - success - login a user with username', async () => {
    const { body, statusCode } = await request(app).post('/user/login').send({
      emailOrUsername: "jasydizzy",
      password: "test",
    })

    expect(statusCode).toBe(200);
    expect(body.msg).toBe('You have successfully logged in');
    expect(body).toHaveProperty('userInfo');
  });

  test('POST /user/login - failure - improper request body', async () => {
    const { body, statusCode } = await request(app).post('/user/login').send({
      username: "jassydizzy",
      password: "irrelevant",
    })

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('msg');
  });

  test('POST /user/login - failure - user does not exist', async () => {
    const { body, statusCode } = await request(app).post('/user/login').send({
      emailOrUsername: "jassydizzy",
      password: "irrelevant",
    })

    expect(statusCode).toBe(404);
    expect(body.msg).toBe('User not found');
  });

  test('POST /user/login - failure - incorrect password', async () => {
    const { body, statusCode } = await request(app).post('/user/login').send({
      emailOrUsername: "jasydizzy",
      password: "tets",
    })

    expect(statusCode).toBe(400);
    expect(body.msg).toBe('Invalid credentials');
  });
});


//Tests user logout
describe('User Logout API Integration test', () => {
  test('POST /user/logout - success', async () => {
    // await request(app).post('/user/register').send({
    //   fullname: "John Doe",
    //   username: "jasydizzy",
    //   email: "jds@example.com",
    //   phonenumber: "08023780045",
    //   password: "test",
    //   confirm_password: "test"
    // })
    // await knex.query('UPDATE users SET verified = true WHERE email = "jds@example.com";')
    const results = await request(app).post('/user/login').send({
      emailOrUsername: "jds@example.com",
      password: "test"
    })
    cookie = results.header["set-cookie"].map((ck: string) => {
      return ck.split(";")[0];
    }).join(";");
    id = results.body.userInfo.id;
    const { body, statusCode } = await request(app).get('/user/logout').set("Cookie", cookie).send();
    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('logged out');
  })
});


//Tests user funds
describe('User Funds API Integration test', () => {
  // beforeAll(async () => {
  //   await request(app).post('/user/register').send({
  //     firstname: "James",
  //     lastname: "Bond",
  //     username: "james007",
  //     email: "jamesbond@example.com",
  //     phonenumber: "08001234007",
  //     password: "test",
  //     confirm_password: "test"
  //   })
  //   const results = await request(app).post('/user/login').send({
  //     emailOrUsername: "james007",
  //     password: "test",
  //   })
  //   cookie = results.header["set-cookie"].map((ck: string) => {
  //     return ck.split(";")[0];
  //   }).join(";");
  // })

  test('PATCH /funds/transfer - success', async () => {
    const { body, statusCode } = await request(app).get('/funds/transfer').set("Cookie", cookie).send({
      amount: 1000,
      email: "maj@gmail.com",
      password: "1234"
    })

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('msg');
    expect(body.msg).toContain('Transfer successful');
  });

  test('PATCH /funds/transfer - failure - Invalid Request Body', async () => {
    const { body, statusCode } = await request(app).get('/funds/transfer').set("Cookie", cookie).send({
      amount: null,
      email: "maj@gmail.com",
      password: "1234"
    })
    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('msg');
  });

  test('PATCH /funds/transfer - failure - Recipient not found', async () => {
    const { body, statusCode } = await request(app).get('/funds/transfer').set("Cookie", cookie).send({
      amount: 1000,
      email: "irrelevant@gmail.com",
      password: "1234"
    })
    expect(statusCode).toBe(404);
    expect(body).toHaveProperty('msg');
  });

  test('PATCH /funds/transfer - failure - incorrect password', async () => {
    const { body, statusCode } = await request(app).post('/funds/transfer').set("Cookie", cookie).send({
      amount: 1000,
      email: "maj@gmail.com",
      password: "tets",
    })

    expect(statusCode).toBe(400);
    expect(body.msg).toBe('Invalid credentials');
  });

  test('PATCH /funds/transfer - failure - insufficient balance', async () => {
    const { body, statusCode } = await request(app).post('/funds/transfer').set("Cookie", cookie).send({
      amount: 100000000,
      email: "maj@gmail.com",
      password: "1234",
    })

    expect(statusCode).toBe(400);
    expect(body.msg).toBe('Insufficient Balance')
  });
});
