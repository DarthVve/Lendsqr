export const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
  }
});

async function DB() {
  await knex.schema.hasTable('users').then(async function (exists: unknown) {
    if (!exists) {
      await knex.schema
        .createTable('users', (table: { integer: (arg0: string) => number; increments: (arg0: string) => void; string: (arg0: string) => void; }) => {
          table.increments('id');
          table.string('fullname')
          table.string('username');
          table.string('email');
          table.string('phonenumber')
          table.integer('wallet');
          table.string('password');
        })
      // .createTable('accounts', (table: { increments: (arg0: string) => void; string: (arg0: string) => void; integer: (arg0: string) => { (): any; new(): any; unsigned: { (): { (): any; new(): any; references: { (arg0: string): void; new(): any; }; }; new(): any; }; }; }) => {
      //   table.increments('id');
      //   table.string('bank_code');
      //   table.string('bank_name');
      //   table.string('account_name');
      //   table.string('account_number');
      //   table
      //     .integer('user_id')
      //     .unsigned()
      //     .references('users.id');
      // })
    }
  });
}

export default DB;
