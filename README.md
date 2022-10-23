# DEMO CREDIT

This is backend application serves as an MVP Wallet Service. It utilizes an  express server which implements an API that enables users; create an account,
own a wallet, transfer funds to other users, and withdraw funds directly to their bank accounts.

## Documentation

The api consists of two collections the user routes and the fund routes.

### User Routes

The user routes facilitates, creating a user account, logging in and logging out a user,
generating a payment link for users to fund their account, and user wallet debit.

[User Routes API Documentation](https://linktodocumentation)

### Fund Routes

The fund routes facilitates, a user transfering funds to other users, a user's withdrawal to their bank account, and user wallet credit.

[Fund Routes API Documentation](https://linktodocumentation)

### Payment Services

On the main branch Flutterwave was incoporated, here is a link to their Documentation.

[Flutterwave API Documentation](https://developer.flutterwave.com/reference/introduction)

On the develop branch Paystack was incoporated, here is a link to their Documentation.

[Paystack API Documentation](https://paystack.com/docs/)

## Entity-Relationship Diagram

[E-R Diagram](https://drive.google.com/file/d/1RcJQjEKwj6yQaDQyLMkNlc2Hfx7lmKXF/view?usp=sharing)

## Environment Variables

To run this project, you will need to add a .db.env file and an .env file.

For the .db.env file add the following environment variables:

`MYSQL_ROOT_PASSWORD` this is the root password for your MySQL database.

`MYSQL_DATABASE` this is whatever name you wish to call your database.

`MYSQL_USER` this is whatever name of the intended user of the database.

`MYSQL_PASSWORD` this is the password for said user to login.

`MYSQL_HOME` this is the path to the directory in which the server-specific my.cnf file resides.

For the .env file add the following environment variables:

`JWT_SECRET`  this is your secret used for token generation

`ROOT_URL`  this is the base url of your app for example <http://locahost:3100> or the link of your deployed app.

`DATABASE` the same value as `MYSQL_DATABASE` in your .db.env.

`DB_USER` the same value as `MYSQL_USER` in your .db.env.

`DB_PASSWORD` the same value as `MYSQL_PASSWORD` in your .db.env.

`DB_HOST` what host your database will connect through.

`DB_PORT` the same value as the port exposed from docker.

`DB_DIALECT` the dialect you wish communicate with your database.

`LD_RUN_PATH` used to specify the location of libmysqlclient.so.

`FLW_SECRET_KEY` the same as your secret api key gotten from your flutterwave dashboard.

Add these if you wish to work with paystack's api instead on the develop branch

`PAYSTACK_SECRET_KEY` the same as your secret api key gotten from your paystack dashboard.

## Run Locally

To run this project you must have docker desktop installed and running  on your local machine.
You will also need to create an account with flutterwave or paystack, depending on what you want to work with,
in other to get your api keys.

Clone the project

```bash
  git clone https://github.com/DarthVve/Lendsqr-Test.git
```

Go to the project directory

```bash
  cd Lendsqr-Test
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn start
```

OR

```bash
  yarn dev
```

 to start the server in development mode

## Running Tests

To run tests, run the following command

```bash
  yarn test
```

## Deployment

This project was deployed on heroku. Here is the link to the base url.
Check the documentation to get an overview and details of it's use cases.

<https://api-demo-credit.herokuapp.com>

NB: The above link may no longer function after 28/11/2022 as heroku are changing their payment plans. This read me shall be updated with the new base url if the former is the case. Or feel free to deploy it yourself.

## Authors

- [Vve](https://www.linkedin.com/in/viremaj)
