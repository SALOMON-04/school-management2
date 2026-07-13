import db from "../db/database.js";
import Teacher from "../models/modelsTeacher.js";
import { createUser } from "./servicesUsers.js";



// CREER UN PROFFESSEUR

const createTeacher = (nom, subject_id, username) => {

    // INSERT LES INFO DU PROFDANS LA TABLE DES UITILISATEURS
    const user_id = createUser(nom, "professeur", username);


    if (user_id?.erreur) return user_id; // Propagation de l'erreur vers le menu

    // CREATION DU PROF EN FONCTION DU MODULE

    const addTeacher = new Teacher(nom, subject_id, user_id);

    const insertTeachers = db.prepare(`
            INSERT OR IGNORE INTO teachers(nom, subject_id, user_id)
            VALUES(?, ?, ?)
        `);



    return insertTeachers.run(addTeacher.nom, addTeacher.subject_id, addTeacher.user_id);


};




// AFFICHER LES PROFFESSEUR

const getAllTeacher = () => {
    return db.prepare(`
            SELECT * FROM teachers
        `).all();
};




// AFFICHE LE PROF EN PRECISENT LE NOM MATIERRE ET NON L'ID DE LA MATIERE

const getAllTeacherAvecMatiere = () => {

    return db.prepare(`
        SELECT teachers.id, teachers.nom, subjects.nom AS matiere
        FROM teachers
        LEFT JOIN subjects ON teachers.subject_id = subjects.id  
    `).all();

};


const getTeacherByUser_id = (user_id) => {
    return db.prepare(`SELECT * FROM teachers WHERE user_id = ?`).get(user_id);
};


// AFFICHER UN PROFFESSEUR

const getTeacherById = (id) => {
    return db.prepare(`
            SELECT * FROM teachers
            WHERE id = ?
        `).get(id);
};




// MODIFIER UN UTILISATEUR

const updateTeacher = (id, data) => {

    const updateTeacherStmt = db.prepare(`
        UPDATE teachers SET  nom = ?, subject_id = ?
        WHERE id = ?
    `);
    return updateTeacherStmt.run(data.nom, data.subject_id, id);
}



// SUPPRIMER UN UTILISATEUR

const deleteTeacher = (id) => {


    const teacher = getAllTeacher();


    // DESACTIVATION DE TEACHER_ID DANS LA TABLE SUBJECT ET REN LA COLONE NULL

    db.prepare(` 
             UPDATE subjects SET teacher_id = NULL WHERE teacher_id = ?
        `).run(id);

    // SUPRESSION DU PROFESSEUR PAR SON ID

    return db.prepare(`
            DELETE FROM teachers WHERE id = ?
        `).run(id);

};



export { createTeacher, getAllTeacher, getAllTeacherAvecMatiere, getTeacherById, getTeacherByUser_id, updateTeacher, deleteTeacher }