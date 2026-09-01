import db from "../db/database.js";
import Student from "../models/modelsStudent.js";
import { createUser } from "./servicesUsers.js";

const createStudent = async (matricule, nom, prenom, age, classe, username, password) => {
    const user_id = await createUser(`${prenom} ${nom}`, "etudiant", username, password);
    if (user_id?.erreur) return user_id;

    const appStudent = new Student(matricule, nom, prenom, age, classe, user_id);

    return await db.execute({
        sql: `INSERT OR IGNORE INTO students(matricule, nom, prenom, age, classe, user_id) VALUES(?, ?, ?, ?, ?, ?)`,
        args: [appStudent.matricule, appStudent.nom, appStudent.prenom, appStudent.age, appStudent.classe, appStudent.user_id]
    });
};

const getAllStudents = async () => {
    const result = await db.execute(`SELECT * FROM students`);
    return result.rows;
};

const getStudentById = async (id) => {
    const result = await db.execute({
        sql: `SELECT * FROM students WHERE id = ?`,
        args: [id]
    });
    return result.rows[0];
};


const getStudentByUserId = async (user_id) => {
    const result = await db.execute({
        sql: `SELECT * FROM students WHERE user_id = ?`,
        args: [user_id]
    });
    return result.rows[0];
};

const getStudentByMatricule = async (matricule) => {
    const result = await db.execute({
        sql: `SELECT * FROM students WHERE matricule = ?`,
        args: [matricule]
    });
    return result.rows[0];
};

const updateStudent = async (id, data) => {
    return await db.execute({
        sql: `UPDATE students SET matricule = ?, nom = ?, prenom = ?, age = ?, classe = ? WHERE id = ?`,
        args: [data.matricule, data.nom, data.prenom, data.age, data.classe, id]
    });
};

const deleteStudent = async (id) => {
    await db.execute({ sql: `DELETE FROM grades WHERE student_id = ?`, args: [id] });
    await db.execute({ sql: `DELETE FROM absences WHERE student_id = ?`, args: [id] });
    return await db.execute({ sql: `DELETE FROM students WHERE id = ?`, args: [id] });
};


const choixEtudiant = async (question) => {
    const etudiants = await getAllStudents();
    let texte = `
    ===========================
        CHOISIR UN ETUDIANT
    ===========================
    `;
    for (let i = 0; i < etudiants.length; i++) {
        texte += `${etudiants[i].id}. ${etudiants[i].prenom} ${etudiants[i].nom} ${etudiants[i].classe}\n`;
    };
    texte += "Votre choix : ";
    const id = await question(texte);
    return Number(id);
};

export { createStudent, getAllStudents, getStudentById, getStudentByUserId, getStudentByMatricule, choixEtudiant, updateStudent, deleteStudent }