import db from "../db/database.js";
import Grades from "../models/modelsGrade.js"




// AJOUTER UNE NOTES

const addNoteGrade = (student_id, subject_id, note) => {


    // Ajout d'un etudiant en fonction de son models
    const appGrades = new Grades(student_id, subject_id, note);

    const insertGrades = db.prepare(`
                INSERT INTO grades(student_id, subject_id, note)
                VALUES(?, ?, ?)
            `);

    return insertGrades.run(appGrades.student_id, appGrades.subject_id, appGrades.note);
}



// MODIFICATION  DE LA NOTE


    //  "data" est une methode qui garde ou receptionne
    //  les nouvelle modification

const updateGrades = (id, data) => {

    const modifGrades = db.prepare(`
            UPDATE grades SET note = ?
            WHERE id = ?
        `);

    return modifGrades.run(data.note, id);
};



// OBTENIR TOUT LA TABLE GRADES


const affGrades = () => {
    return db.prepare(`
            SELECT * FROM grades
        `).all()
}



// OBTENIR NOTE ET MOYEN D'UN ETUDIANT



// LIST DES NOTES D'UN ETUDIANT DANS UNE MATIERE PRECISE

const getStudentGrades = (studentId, subjectId) => {

    return db.prepare(`
            SELECT * FROM  grades
            WHERE student_id = ?
            AND subject_id = ?
        `).all(studentId, subjectId)
};


// CALCUL DE MOYENNE 

const calculMoyenne = (student_id, subject_id) => {

    // NOTES recupère l'id de l'etudiant et la matière souhaitée 
    // pour le calcule de la moyennne

    const NOTES = getStudentGrades(student_id, subject_id);


    // Cette condition vérifie si la colone de l'étudiant et la matière
    // ne sont pas vide si oui alors elle retourne 0
    
    if (NOTES.length === 0) {
        return 0;
    };


    let somme = 0;

    for (let i = 0; i < NOTES.length; i++) {
        somme += NOTES[i].note;
    }


    // Récupération des infos de l'étudiant

    const student = db.prepare(`
            SELECT matricule, nom, prenom, age, classe
            FROM students 
            WHERE id = ?
        `).get(student_id) ;



    // Affichage des info de l'étudiant et sa moyennne

    return {
        ...student,
       moyenne : somme / NOTES.length
    } ;
    
};



// MOYENNE DU MEILLEUR ETUDIANT DANS UNE MATIERES

const meilleurEtudiant = (subject_id) => {


    // Selectionner les étudiant de manière unique (DISTINCT)
    // afin de parcourrir leur information de manière spécifique

    const meilleur = db.prepare(`
            SELECT DISTINCT student_id
            FROM grades
            WHERE subject_id = ?
        `).all(subject_id);

        
    // Aucune note dans cette matière
    if (meilleur.length === 0) {
        console.log("Aucune note disponible pour cette matière.");
        return null;
    }


        // les varible qui vont recevoir l'id 
        // de l'étudiant et sa moyenne en fonction de la matière

    let bestEtudiant = null;
    let meilleurMoyenne = 0;

    for (let i = 0; i < meilleur.length; i++) {


        // appel du service calculMoyenne pour vériffier
        //  pour chaque etudiant dans la boucle

        const maMoyenne = calculMoyenne(
            meilleur[i].student_id,
            subject_id
        );


        if (maMoyenne > meilleurMoyenne) {
            meilleurMoyenne = maMoyenne;
            bestEtudiant = meilleur[i].student_id
        };
    };


    // récupérer le nom de la matière

    const matiere = db.prepare(`
        SELECT nom FROM subjects WHERE id = ?
    `).get(subject_id);



    // récupération des infos de l'étudiant

    const student = db.prepare(`
        SELECT matricule, nom, prenom FROM students WHERE id = ?
    `).get(bestEtudiant);



    // Afficher les info de l'etudiant ainsi que sa moyenne

    return {
        student_id: bestEtudiant,
        Nom_Complet: `${student.matricule} ${student.prenom} ${student.nom}`,
        matiere: matiere.nom,
        maMoyenne: meilleurMoyenne
    };


};





// SUPPRIMER UNE NOTE

const deleteGrades = (id) => {

    
    return db.prepare(`
            DELETE FROM grades 
            WHERE id = ?
    `).run(id);
};




export { addNoteGrade, updateGrades, deleteGrades, affGrades, getStudentGrades, calculMoyenne, meilleurEtudiant }


