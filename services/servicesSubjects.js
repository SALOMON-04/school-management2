
import db from "../db/database.js"
import Subject from "../models/modelsSubject.js"





// AJOUR UNE MATIERE

const createSubject = (nom) => {

  //AJOUT D'UNE MATIERE EN FONCTION DU MODEL SUBJECT

    const addSubject = new Subject(nom);

    const insertSubjects = db.prepare(`
        INSERT OR IGNORE INTO subjects (nom)
        VALUES(?)
        `);

  return insertSubjects.run(addSubject.nom);
};



//LISTE DES MATIERES

const getAllSubjects = () => {
  return db.prepare(`
            SELECT * FROM subjects
     `,).all();
};



//AFFICHER UNE MATIER 

const getSubjectById = (id) => {

  return db.prepare(`
            SELECT * FROM subjects
            WHERE id = ?
    `).get(id);
    
};


// AFFECTATION D'UNE MATIERE A UN PROF

const affectTeacherSubject = (subjectId, teacherId) => {

  const assign = db.prepare(`
            UPDATE subjects 
            SET teacher_id = ?
            WHERE id = ?
        `);

  return assign.run(teacherId, subjectId);
}


// MODIFIER UNE MATIERE


const updateASubject = (id, data) =>{

  const updateMatiere = db.prepare(`
      UPDATE subjects  SET nom = ? 
      WHERE id = ?
    `)

    return updateMatiere.run(data.nom, id)
}



// CHOISIR UNE POUR LE PROF ET L'ETUDIANT : on fait corresponde le choix  à l'id voulu  

const choixMatiere = async (question, teacher_id = null) => {


  let matieres ;

  if(teacher_id){
    matieres = db.prepare(`SELECT * FROM subjects WHERE teacher_id = ?`).all(teacher_id);
  }else{
    matieres = getAllSubjects();
  }


  let texte = `
===========================
|   CHOISIR UNE MATIERE   |
===========================

`;


  for (let i = 0; i < matieres.length; i++){

    texte += `${matieres[i].id}. ${matieres[i].nom}\n`
  }

  texte += "Votre choix : ";

  const id = await question(texte);
  return Number(id);

}






// SUPPRESSION D'UNE MATIERE


const deleteSubject = (id) => {

  //suppression de la clé subject dans la table subject
  db.prepare(`UPDATE teachers SET subject_id = NULL WHERE subject_id = ?`).run(id);


  //spression de la clé lier au notes dans la table grades
  db.prepare(`DELETE FROM grades WHERE subject_id = ?`).run(id);


  //suppression de la matiè!re

  return db.prepare(`
            DELETE FROM subjects 
            WHERE  id = ?
        `).run(id)

};


export { createSubject, getAllSubjects, getSubjectById, updateASubject, choixMatiere, affectTeacherSubject, deleteSubject }


