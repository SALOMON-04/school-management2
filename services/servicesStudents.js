import db from "../db/database.js";
import Student from "../models/modelsStudent.js";
import { createUser } from "./servicesUsers.js";


const createStudent = async (matricule, nom, prenom, age, classe, username, password) => {

    const user_id = await createUser(`${prenom} ${nom}`, "etudiant", username, password);

    if (user_id?.erreur) return user_id;

    const appStudent = new Student(matricule, nom, prenom, age, classe, user_id);

    const insertStudents = await db.prepare(`
            INSERT OR IGNORE INTO students(matricule, nom, prenom, age, classe, user_id)
            VALUES(?, ?, ?, ?, ?, ?)
        `);

    return await insertStudents.run(appStudent.matricule, appStudent.nom, appStudent.prenom, appStudent.age, appStudent.classe, appStudent.user_id);
};


const getAllStudents = async () => {
    return await (await db.prepare(`SELECT * FROM students`)).all();
};


const getStudentById = async (id) => {
    return await (await db.prepare(`
            SELECT * FROM students
            WHERE id = ?
        `)).get(id);
};


const getStudentByMatricule = async (matricule) => {
    return await (await db.prepare(`
        SELECT * FROM students WHERE matricule = ?
    `)).get(matricule);
};


const updateStudent = async (id, data) => {

    const updateStudentStmt = await db.prepare(`
        UPDATE students SET matricule = ?, nom = ?, prenom = ?, age = ?, classe = ?
        WHERE id = ?
    `);

    return await updateStudentStmt.run(data.matricule, data.nom, data.prenom, data.age, data.classe, id);
}


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

    return Number(id)
}


const deleteStudent = async (id) => {

    await (await db.prepare(`DELETE FROM grades WHERE student_id = ?`)).run(id);
    await (await db.prepare(`DELETE FROM absences WHERE student_id = ?`)).run(id);

    return await (await db.prepare(`
            DELETE FROM students WHERE id = ?
        `)).run(id);
};


export { createStudent, getAllStudents, getStudentById, getStudentByMatricule, updateStudent, choixEtudiant, deleteStudent }