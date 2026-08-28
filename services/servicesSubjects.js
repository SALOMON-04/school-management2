import db from "../db/database.js"
import Subject from "../models/modelsSubject.js"


const createSubject = async (nom) => {

  const addSubject = new Subject(nom);

  const insertSubjects = await db.prepare(`
        INSERT OR IGNORE INTO subjects (nom)
        VALUES(?)
        `);

  return await insertSubjects.run(addSubject.nom);
};


const getAllSubjects = async () => {
  return await (await db.prepare(`
        SELECT subjects.*, teachers.nom as teacher_nom
        FROM subjects
        LEFT JOIN teachers ON subjects.teacher_id = teachers.id
    `)).all();
};


const getSubjectById = async (id) => {
  return await (await db.prepare(`
            SELECT * FROM subjects
            WHERE id = ?
    `)).get(id);
};


const affectTeacherSubject = async (subjectId, teacherId) => {

  const assign = await db.prepare(`
            UPDATE subjects 
            SET teacher_id = ?
            WHERE id = ?
        `);

  return await assign.run(teacherId, subjectId);
}


const updateASubject = async (id, data) => {

  const updateMatiere = await db.prepare(`
      UPDATE subjects  SET nom = ?, teacher_id= ?
      WHERE id = ?
    `)

  return await updateMatiere.run(data.nom, data.teacher_id ?? null, id)
}


const choixMatiere = async (question, teacher_id = null) => {

  let matieres;

  if (teacher_id) {
    matieres = await (await db.prepare(`SELECT * FROM subjects WHERE teacher_id = ?`)).all(teacher_id);
  } else {
    matieres = await getAllSubjects();
  }

  let texte = `
===========================
|   CHOISIR UNE MATIERE   |
===========================

`;

  for (let i = 0; i < matieres.length; i++) {
    texte += `${matieres[i].id}. ${matieres[i].nom}\n`
  }

  texte += "Votre choix : ";

  const id = await question(texte);
  return Number(id);
}


const deleteSubject = async (id) => {

  await (await db.prepare(`UPDATE teachers SET subject_id = NULL WHERE subject_id = ?`)).run(id);

  await (await db.prepare(`DELETE FROM grades WHERE subject_id = ?`)).run(id);

  return await (await db.prepare(`
            DELETE FROM subjects 
            WHERE  id = ?
        `)).run(id)
};


export { createSubject, getAllSubjects, getSubjectById, updateASubject, choixMatiere, affectTeacherSubject, deleteSubject }