import db from "../db/database.js";
import Grades from "../models/modelsGrade.js"

import { getTeacherById } from "./servicesTeachers.js";
import { getClasseByTeacher } from "./serviceTeachers_classes.js";
import { getAllStudents } from "./servicesStudents.js";


const addNoteGrade = async (student_id, subject_id, note) => {

    const appGrades = new Grades(student_id, subject_id, note);

    const insertGrades = await db.prepare(`
                INSERT INTO grades(student_id, subject_id, note)
                VALUES(?, ?, ?)
            `);

    return await insertGrades.run(appGrades.student_id, appGrades.subject_id, appGrades.note);
}


const updateGrades = async (id, data) => {

    const modifGrades = await db.prepare(`
            UPDATE grades SET note = ?
            WHERE id = ?
        `);

    return await modifGrades.run(data.note, id);
};


const affGrades = async () => {
    return await (await db.prepare(`
        SELECT 
            grades.id,
            grades.note,
            grades.student_id,
            grades.subject_id,
            students.nom,
            students.prenom,
            students.classe,
            subjects.nom as subject_nom
        FROM grades
        LEFT JOIN students ON grades.student_id = students.id
        LEFT JOIN subjects ON grades.subject_id = subjects.id
    `)).all();
};


const getStudentGrades = async (studentId, subjectId) => {

    return await (await db.prepare(`
            SELECT * FROM  grades
            WHERE student_id = ?
            AND subject_id = ?
        `)).all(studentId, subjectId)
};


const getGradesByTeacher = async (teacher_id) => {

    const teacher = await getTeacherById(teacher_id);
    if (!teacher) return [];

    const classesRows = await getClasseByTeacher(teacher_id);
    const classes = classesRows.map((c) => c.classe);
    if (classes.length === 0) return [];

    const allStudents = await getAllStudents();
    const students = allStudents.filter((s) => classes.includes(s.classe));
    const studentIds = students.map((s) => s.id);

    const allNotes = await affGrades();
    const notes = allNotes.filter(
        (note) => note.subject_id === teacher.subject_id && studentIds.includes(note.student_id)
    );

    return notes;
};


const calculMoyenne = async (student_id, subject_id) => {

    const NOTES = await getStudentGrades(student_id, subject_id);

    if (NOTES.length === 0) {
        return 0;
    };

    let somme = 0;

    for (let i = 0; i < NOTES.length; i++) {
        somme += NOTES[i].note;
    }

    const student = await (await db.prepare(`
            SELECT matricule, nom, prenom, age, classe
            FROM students 
            WHERE id = ?
        `)).get(student_id);

    return { ...student, moyenne: somme / NOTES.length };
};


const meilleurEtudiant = async (subject_id) => {

    const meilleur = await (await db.prepare(`
            SELECT DISTINCT student_id
            FROM grades
            WHERE subject_id = ?
        `)).all(subject_id);

    if (meilleur.length === 0) {
        return null;
    }

    let bestEtudiant = null;
    let meilleurMoyenne = 0;

    for (let i = 0; i < meilleur.length; i++) {

        const maMoyenne = await calculMoyenne(meilleur[i].student_id, subject_id);

        if (maMoyenne > meilleurMoyenne) {
            meilleurMoyenne = maMoyenne;
            bestEtudiant = meilleur[i].student_id
        };
    };

    const matiere = await (await db.prepare(`SELECT nom FROM subjects WHERE id = ?`)).get(subject_id);

    const student = await (await db.prepare(`SELECT matricule, nom, prenom FROM students WHERE id = ?`)).get(bestEtudiant);

    return {
        student_id: bestEtudiant,
        Nom_Complet: `${student.matricule} ${student.prenom} ${student.nom}`,
        matiere: matiere.nom,
        maMoyenne: meilleurMoyenne
    };
};


const deleteGrades = async (id) => {
    return await (await db.prepare(`DELETE FROM grades WHERE id = ?`)).run(id);
};


export { addNoteGrade, updateGrades, deleteGrades, affGrades, getStudentGrades, getGradesByTeacher, calculMoyenne, meilleurEtudiant }