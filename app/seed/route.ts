import bcrypt from 'bcrypt';
//import { db } from '@vercel/postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';
import { Client }  from 'pg';
// import * as dotenv from 'dotenv';
// dotenv.config({path : '../../.env'})

// require('dotenv').config({ path: '../../../.env'});


const pool = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_NAME,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});


pool.connect()
    .then(() => {
      console.log("connected to db!")
    })

console.log("Connection!")
const client = pool;

console.log("Cloned!")


async function seedUsers() {
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  console.log("Extended!")

  await client.query(`CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

  console.log("querty tme");
  const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.query(`
        INSERT INTO users (id, name, email, password)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING;
      `, [user.id, user.name, user.email, hashedPassword]);
      }),
  );
  console.log("look i'm here!")

  return insertedUsers;
}

async function seedInvoices() {
  console.log("Invoices!")
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  await client.query(`CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `);
  console.log("Invoices Tabled!")

  const insertedInvoices = await Promise.all(
      invoices.map(
          (invoice) => client.query(`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING;
      `,
              [invoice.customer_id, invoice.amount, invoice.status, invoice.date]),
      ),

  );
  console.log("Carried!")

  return insertedInvoices;
}

async function seedCustomers() {
  console.log("Customers!")
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  await client.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `);

  const insertedCustomers = await Promise.all(
      customers.map(
          (customer) => client.query(`
                INSERT INTO customers (id, name, email, image_url)
                VALUES ($1, $2, $3, $4)
                  ON CONFLICT (id) DO NOTHING;
              `,
              [customer.id, customer.name, customer.email, customer.image_url]),
      ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await client.query(`CREATE TABLE IF NOT EXISTS revenue (
                                                           month VARCHAR(4) NOT NULL UNIQUE,
    revenue INT NOT NULL
    );
  `);

  const insertedRevenue = await Promise.all(
      revenue.map(
          (rev) => client.query(`
            INSERT INTO revenue (month, revenue)
            VALUES ($1, $2)
              ON CONFLICT (month) DO NOTHING;
          `, [rev.month, rev.revenue]),
      ),
  );

  return insertedRevenue;
}

export async function GET() {
  // return Response.json({
  //   message:
  //     'Uncomment this file and remove this line. You can delete this file when you are finished.',
  // });
  try {

    console.log("BEGING!")
   await client.query(`BEGIN`);
    console.log("yay")
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();
    console.log("it's over!")
     await client.query(`COMMIT`);
    console.log("I have the high ground!!")

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.query(`ROLLBACK`);
    return Response.json({ error }, { status: 500 });
  }
}
