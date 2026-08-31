import db from "../db/database.js";
import Teacher from "../models/modelsTeacher.js";
import { createUser } from "./servicesUsers.js";

const createTeacher = async (nom, subject_id, username, password) => {
    const user_id = await createUser(nom, "professeur", username, password);
    if (user_id?.erreur) return user_id;

    const addTeacher = new Teacher(nom, subject_id, user_id);

    return await db.execute({
        sql: `INSERT OR IGNORE INTO teachers(nom, subject_id, user_id) VALUES(?, ?, ?)`,
        args: [addTeacher.nom, addTeacher.subject_id, addTeacher.user_id]
    });
};

const getAllTeacher = async () => {
    const result = await db.execute(`
        SELECT teachers.*, subjects.nom as matiere
        FROM teachers
        LEFT JOIN subjects ON teachers.subject_id = subjects.id
    `);
    return result.rows;
};

const getAllTeacherAvecMatiere = async (matiere) => {
    const result = await db.execute({
        sql: `SELECT teachers.id, teachers.nom, subjects.nom AS matiere
              FROM teachers
              INNER JOIN subjects ON teachers.subject_id = subjects.id
              WHERE subjects.nom = ?`,
        args: [matiere]
    });
    return result.rows;
};

const getTeacherByUser_id = async (user_id) => {
    const result = await db.execute({
        sql: `SELECT * FROM teachers WHERE user_id = ?`,
        args: [user_id]
    });
    return result.rows[0];
};

const getTeacherById = async (id) => {
    const result = await db.execute({
        sql: `SELECT * FROM teachers WHERE id = ?`,
        args: [id]
    });
    return result.rows[0];
};

const updateTeacher = async (id, data) => {
    return await db.execute({
        sql: `UPDATE teachers SET nom = ?, subject_id = ? WHERE id = ?`,
        args: [data.nom, data.subject_id, id]
    });
};

const deleteTeacher = async (id) => {
    await db.execute({ sql: `UPDATE subjects SET teacher_id = NULL WHERE teacher_id = ?`, args: [id] });
    return await db.execute({ sql: `DELETE FROM teachers WHERE id = ?`, args: [id] });
};

export { createTeacher, getAllTeacher, getAllTeacherAvecMatiere, getTeacherById, getTeacherByUser_id, updateTeacher, deleteTeacher }