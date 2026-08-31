import db from "../db/database.js";
import Subject from "../models/modelsSubject.js";

const createSubject = async (nom) => {
    const addSubject = new Subject(nom);
    return await db.execute({
        sql: `INSERT OR IGNORE INTO subjects (nom) VALUES(?)`,
        args: [addSubject.nom]
    });
};

const getAllSubjects = async () => {
    const result = await db.execute(`
        SELECT subjects.*, teachers.nom as teacher_nom
        FROM subjects
        LEFT JOIN teachers ON subjects.teacher_id = teachers.id
    `);
    return result.rows;
};

const getSubjectById = async (id) => {
    const result = await db.execute({
        sql: `SELECT * FROM subjects WHERE id = ?`,
        args: [id]
    });
    return result.rows[0];
};

const affectTeacherSubject = async (subjectId, teacherId) => {
    return await db.execute({
        sql: `UPDATE subjects SET teacher_id = ? WHERE id = ?`,
        args: [teacherId, subjectId]
    });
};

const updateASubject = async (id, data) => {
    return await db.execute({
        sql: `UPDATE subjects SET nom = ?, teacher_id = ? WHERE id = ?`,
        args: [data.nom, data.teacher_id ?? null, id]
    });
};

const deleteSubject = async (id) => {
    await db.execute({ sql: `UPDATE teachers SET subject_id = NULL WHERE subject_id = ?`, args: [id] });
    await db.execute({ sql: `DELETE FROM grades WHERE subject_id = ?`, args: [id] });
    return await db.execute({ sql: `DELETE FROM subjects WHERE id = ?`, args: [id] });
};




const choixMatiere = async (question, teacher_id = null) => {
    let matieres;
    if (teacher_id) {
        const result = await db.execute({
            sql: `SELECT * FROM subjects WHERE teacher_id = ?`,
            args: [teacher_id]
        });
        matieres = result.rows;
    } else {
        matieres = await getAllSubjects();
    }

    let texte = `
===========================
|   CHOISIR UNE MATIERE   |
===========================
`;
    for (let i = 0; i < matieres.length; i++) {
        texte += `${matieres[i].id}. ${matieres[i].nom}\n`;
    }
    texte += "Votre choix : ";
    const id = await question(texte);
    return Number(id);
};

export { createSubject, getAllSubjects, getSubjectById, updateASubject, choixMatiere, affectTeacherSubject, deleteSubject }