import {Pool} from "pg";

class Database{
    private static instance: Pool;

    private constructor() {
    }
w
    public static getInstance(): Pool {
        if (!Database.instance) {
            Database.instance = new Pool({
                database: process.env.POSTGRES_NAME,
                host: process.env.POSTGRES_HOST,
                password: process.env.POSTGRES_PASSWORD,
                port: Number(process.env.POSTGRES_PORT),
                max: 10,
                idleTimeoutMillis: 10000,
                user: process.env.POSTGRES_USER,
            });
            Database.instance
                .on("error", (err) => console.log(err));
        }

        return Database.instance;
    }

}

export default Database;