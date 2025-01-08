import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({path: ".env"});

async function ensureDatabaseExists(dbname: string) {
    const client = new Client({
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: 'user', // Connect to the default database
    });

    try {
        console.log("Connecting to: " + client.host)
        await client.connect();
        const dbName = dbname;

        // Check if the database exists
        const result = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbName]
        );

        if (result.rowCount === 0) {
            // Create the database if it doesn't exist
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database "${dbName}" created.`);
        } else {
            console.log(`Database "${dbName}" already exists.`);
        }
    } catch (err) {
        console.error('Error ensuring database exists:', err);
    } finally {
        await client.end();
    }
}

const dbName = process.argv[2];
if(!dbName) {
    console.error("Database name is required");
    process.exit(1);
}

ensureDatabaseExists(dbName);