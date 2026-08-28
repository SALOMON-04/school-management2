import db from "../db/database.js";
import Teacher from "../models/modelsTeacher.js";
import { createUser } from "./servicesUsers.js";


const createTeacher = async (nom, subject_id, username, password) => {

    const user_id = await createUser(nom, "professeur", username, password);

    if (user_id?.erreur) return user_id;

    const addTeacher = new Teacher(nom, subject_id, user_id);

    const insertTeachers = await db.prepare(`
            INSERT OR IGNORE INTO teachers(nom, subject_id, user_id)
            VALUES(?, ?, ?)
        `);

    return await insertTeachers.run(addTeacher.nom, addTeacher.subject_id, addTeacher.user_id);
};


const getAllTeacher = async () => {
    return await (await db.prepare(`
        SELECT teachers.*, subjects.nom as matiere
        FROM teachers
        LEFT JOIN subjects ON teachers.subject_id = subjects.id
    `)).all();
};


const getAllTeacherAvecMatiere = async (matiere) => {

    return await (await db.prepare(`
        SELECT teachers.id, teachers.nom, subjects.nom AS matiere
        FROM teachers
        INNER JOIN subjects ON teachers.subject_id = subjects.id  
        WHERE subjects.nom = ?
    `)).all(matiere);
};


const getTeacherByUser_id = async (user_id) => {
    return await (await db.prepare(`SELECT * FROM teachers WHERE user_id = ?`)).get(user_id);
};


const getTeacherById = async (id) => {
    return await (await db.prepare(`
            SELECT * FROM teachers
            WHERE id = ?
        `)).get(id);
};


const updateTeacher = async (id, data) => {

    const updateTeacherStmt = await db.prepare(`
        UPDATE teachers SET  nom = ?, subject_id = ?
        WHERE id = ?
    `);
    return await updateTeacherStmt.run(data.nom, data.subject_id, id);
}


const deleteTeacher = async (id) => {

    await (await db.prepare(`
             UPDATE subjects SET teacher_id = NULL WHERE teacher_id = ?
        `)).run(id);

    return await (await db.prepare(`
            DELETE FROM teachers WHERE id = ?
        `)).run(id);
};


export { createTeacher, getAllTeacher, getAllTeacherAvecMatiere, getTeacherById, getTeacherByUser_id, updateTeacher, deleteTeacher }