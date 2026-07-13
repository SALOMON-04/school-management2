import db from "../db/database.js";
import Student from "../models/modelsStudent.js";

import { createUser } from "./servicesUsers.js";



// CREATION DE L'ETUDIANT

const createStudent = (matricule, nom, prenom, age, classe, username) => {


    // AJOUT DE L'ETUDIANT DANS LA TABLE DES UTILISATEUR
    const user_id = createUser(`${prenom} ${nom}`, "etudiant", username);


    if (user_id?.erreur) return user_id; // propagation de l'erreure vers le menu


    // creation de létudient en fonction de son module
    const appStudent = new Student(matricule, nom, prenom, age, classe, user_id);

    const insertStudents = db.prepare(`
            INSERT OR IGNORE INTO students(matricule, nom, prenom, age, classe, user_id)
            VALUES(?, ?, ?, ?, ?, ?)
        `);


    return insertStudents.run(appStudent.matricule, appStudent.nom, appStudent.prenom, appStudent.age, appStudent.classe, appStudent.user_id);


};


// AFFICHER TOUS LES ETUDIANT

const getAllStudents = () => {
    return db.prepare(`
            SELECT * FROM students
        `).all();
};


// AFFICHER UN ETUDIANT

const getStudentById = (id) => {

    return db.prepare(`
            SELECT * FROM students
            WHERE id = ?
        `).get(id);

};


// RECHERCHE UN ETUDIANT PAR MATRICULE

const getStudentByMatricule = (matricule) => {
    return db.prepare(`
        SELECT * FROM students WHERE matricule = ?
    `).get(matricule);
};



// MODIFIER UN ETUDIANT

const updateStudent = (id, data) => {

    const updateStudentStmt = db.prepare(`
        UPDATE students SET matricule = ?, nom = ?, prenom = ?, age = ?, classe = ?
        WHERE id = ?
    `);

    return updateStudentStmt.run(data.matricule, data.nom, data.prenom, data.age, data.classe, id);

}



// CHOISIR UN ETUDIANT POUR LE PROF : on fait corresponde le choix du prof à
// l'id de l'etudiant sans que le prof sache ce que c'est 

const choixEtudiant = async (question) => {

    const etudiants = getAllStudents();

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



// SUPPRIMER UN ETUDIANT

const deleteStudent = (id) => {

    const student = getAllStudents() ;

    //on supprime aussi ses abscences et notes
    db.prepare(`DELETE FROM grades WHERE student_id = ?`).run(id);
    db.prepare(`DELETE FROM absences WHERE student_id = ?`).run(id);
    
    return db.prepare(`
            DELETE FROM students WHERE id = ?
        `).run(id);
        
};



export { createStudent, getAllStudents, getStudentById, getStudentByMatricule, updateStudent, choixEtudiant, deleteStudent }
