import Database from "better-sqlite3";
import path from "path";
import { connect } from "@tursodatabase/serverless";

// const db = new Database("school.db")

const db = connect({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
});





export default db ;