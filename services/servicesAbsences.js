import db from "../db/database.js";
import Absence from "../models/modelsAbsence.js"


import { getAllStudents } from "./servicesStudents.js";
import { getClasseByTeacher } from "../services/serviceTeachers_classes.js"



const createAbsence = (student_id, status) => {

    // "data"  permet de géré la date de manière automatique 
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    

    // Permet d'ajouter lesabsence en fonction du models Absense
    const appAbscence = new Absence(student_id, date, status) ;

    const insertAbscence = db.prepare(`
            INSERT INTO absences (student_id, date, status)
            VALUES(?, ?, ?)
        `)

        return insertAbscence.run(appAbscence.student_id, appAbscence.date, appAbscence.status)
} ;



// AFFICHER LA TABLE D'ABSCENCE

const getAllAbscence = () => {
    return db.prepare(`
            SELECT * FROM absences
        `).all();
};



// AFICHER LES ABSCENCE D'UN ETUDIANT

const getAbsenceById = (id) => {

    return db.prepare(`
            SELECT * FROM absences
            WHERE id = ?
        `).get(id);

};




// RECHERCHE DES ABSCENCE LIER A UN PROF ET SA MATIERE UNIQUEMENT

const getAbsencesByTeacher = (teacher_id) => {

    // Classes assignées à ce prof
    const classes = getClasseByTeacher(teacher_id).map((c) => c.classe);
    if (classes.length === 0) return [];

    // Étudiants de ces classes
    const students = getAllStudents().filter((s) => classes.includes(s.classe));
    const studentIds = students.map((s) => s.id);

    // Absences de ces étudiants uniquement
    const absences = getAllAbscence().filter((a) => studentIds.includes(a.student_id));

    return absences;
};





// MODIFIER L'ABSCENCE


// "data" est une methode qui va conservé ou recupéré les nouvelle information entrées

const updateAbsence = (id, data) => {

    const updateTeacherStmt = db.prepare(`
        UPDATE absences SET student_id = ?,
        date = ?,
        status = ?
        WHERE id = ?
    `);

    return updateTeacherStmt.run(data.student_id, data.date, data.status, id);
}



// SUPPRIMER UNE ABSENCE

const deleteAbsence = (id) => {

    
    return db.prepare(`
            DELETE FROM absences WHERE id = ?
        `).run(id);
};




// COMPTER LES ABSENCE 

const nombreAbsences = (studentId) => {

    // COUNT(*) compte simplement le nombre total de lignes (d'enregistrements) qui existent dans le tableau, même si certaines cases sont vides.
    // "AS" Ce mot-clé sert à donner un surnom (un alias) temporaire à une colonne dans le résultat final

    const result = db.prepare(`
        SELECT COUNT(*) AS total
        FROM absences
        WHERE student_id = ?
        AND status = ?
    `).get(studentId, "Non justifié"); //le status "non justifié "car c'est celui qui considère 
                                        // que l'étudiant est absent lors du cours

    return result.total;
};



// AFFICHER TOUTE LES ABSENCE D'UN ETUDIANT

const getStudentAbsences = (studentId) => {

    return db.prepare(`
            SELECT * FROM absences
            WHERE student_id = ?
        `).all(studentId);

};



export {createAbsence, getAllAbscence, getAbsenceById, getAbsencesByTeacher, updateAbsence, deleteAbsence, nombreAbsences, getStudentAbsences}