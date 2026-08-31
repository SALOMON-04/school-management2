import { createClient } from "@libsql/client";

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
});

const db = {
    prepare(sql) {
        return {
            async get(args = []) {
                const result = await client.execute({ sql, args });
                return result.rows[0];
            },
            async all(args = []) {
                const result = await client.execute({ sql, args });
                return result.rows;
            },
            async run(args = []) {
                const result = await client.execute({ sql, args });
                return { changes: result.rowsAffected, lastInsertRowid: result.lastInsertRowid };
            }
        };
    },
    execute(query) {
        return client.execute(query);
    }
};

export default db;
