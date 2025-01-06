import Database from "../lib/db"

const pool = Database.getInstance();

async function listInvoices() {
    const data =
        await pool.query(`SELECT invoices.amount, customers.name
                             FROM invoices
                             JOIN customers ON invoices.customer_id = customers.id
                             WHERE invoices.amount = 666;
                            `);
    console.log(data);
    return data.rows;
}

export async function GET() {
    try {
        return Response.json(await listInvoices());
    } catch (error) {
        return Response.json({error}, {status: 500});
    }
}
