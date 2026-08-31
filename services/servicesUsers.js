import db from "../db/database.js";
import Users from "../models/modelsUser.js";
import bcrypt from "bcrypt";

const createUser = async (nom, role, username, password) => {
    const existant = await db.execute({
        sql: `SELECT id FROM users WHERE username = ?`,
        args: [username]
    });

    if (existant.rows[0]) {
        return { erreur: `${username} déjà utilisé, veuillez choisir un autre username` };
    };

    if (password.length < 6) {
        return { erreur: "le champ doit contenir au moins 6 caractères" };
    };

    const passwordHash = await bcrypt.hash(password, 10);
    const addUsers = new Users(nom, role, username, passwordHash);

    const result = await db.execute({
        sql: `INSERT INTO users(nom, role, username, password) VALUES(?, ?, ?, ?)`,
        args: [addUsers.nom, addUsers.role, addUsers.username, addUsers.password]
    });

    return result.lastInsertRowid;
};

const getAllUsers = async () => {
    const result = await db.execute(`SELECT * FROM users`);
    return result.rows;
};

const getUserById = async (id) => {
    const result = await db.execute({
        sql: `SELECT * FROM users WHERE id = ?`,
        args: [id]
    });
    return result.rows[0];
};

const getUserByUsername = async (username) => {
    const result = await db.execute({
        sql: `SELECT * FROM users WHERE username = ?`,
        args: [username]
    });
    return result.rows[0];
};

const updateUsers = async (id, data) => {
    return await db.execute({
        sql: `UPDATE users SET nom = ?, role = ?, username = ? WHERE id = ?`,
        args: [data.nom, data.role, data.username, id]
    });
};

const deleteUser = async (id) => {
    const student = await db.execute({
        sql: `SELECT * FROM students WHERE user_id = ?`,
        args: [id]
    });

    if (student.rows[0]) {
        await db.execute({ sql: `DELETE FROM grades WHERE student_id = ?`, args: [student.rows[0].id] });
        await db.execute({ sql: `DELETE FROM absences WHERE student_id = ?`, args: [student.rows[0].id] });
        await db.execute({ sql: `DELETE FROM students WHERE id = ?`, args: [student.rows[0].id] });
    }

    const teacher = await db.execute({
        sql: `SELECT * FROM teachers WHERE user_id = ?`,
        args: [id]
    });

    if (teacher.rows[0]) {
        await db.execute({ sql: `UPDATE subjects SET teacher_id = NULL WHERE teacher_id = ?`, args: [teacher.rows[0].id] });
        await db.execute({ sql: `DELETE FROM teachers WHERE id = ?`, args: [teacher.rows[0].id] });
    }

    return await db.execute({ sql: `DELETE FROM users WHERE id = ?`, args: [id] });
};

export { createUser, getAllUsers, getUserByUsername, updateUsers, getUserById, deleteUser }