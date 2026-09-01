import db from "../db/database.js";
import Grades from "../models/modelsGrade.js";
import { getTeacherById } from "./servicesTeachers.js";
import { getClasseByTeacher } from "./serviceTeachers_classes.js";
import { getAllStudents } from "./servicesStudents.js";

const addNoteGrade = async (student_id, subject_id, note) => {
    const appGrades = new Grades(student_id, subject_id, note);
    return await db.execute({
        sql: `INSERT INTO grades(student_id, subject_id, note) VALUES(?, ?, ?)`,
        args: [appGrades.student_id, appGrades.subject_id, appGrades.note]
    });
};

const updateGrades = async (id, data) => {
    return await db.execute({
        sql: `UPDATE grades SET note = ? WHERE id = ?`,
        args: [data.note, id]
    });
};

const affGrades = async () => {
    const result = await db.execute(`
        SELECT 
            grades.id, grades.note, grades.student_id, grades.subject_id,
            students.nom, students.prenom, students.classe,
            subjects.nom as subject_nom
        FROM grades
        LEFT JOIN students ON grades.student_id = students.id
        LEFT JOIN subjects ON grades.subject_id = subjects.id
    `);
    return result.rows;
};

const getStudentGrades = async (studentId, subjectId) => {
    const result = await db.execute({
        sql: `SELECT * FROM grades WHERE student_id = ? AND subject_id = ?`,
        args: [studentId, subjectId]
    });
    return result.rows;
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
    return allNotes.filter(
        (note) => note.subject_id === teacher.subject_id && studentIds.includes(note.student_id)
    );
};



const getAllGradesByStudent = async (studentId) => {
    const result = await db.execute({
        sql: `SELECT grades.*, subjects.nom as subject_nom
              FROM grades
              LEFT JOIN subjects ON grades.subject_id = subjects.id
              WHERE grades.student_id = ?`,
        args: [studentId]
    });
    return result.rows;
};



const calculMoyenne = async (student_id, subject_id) => {
    const NOTES = await getStudentGrades(student_id, subject_id);
    if (NOTES.length === 0) return 0;

    let somme = 0;
    for (let i = 0; i < NOTES.length; i++) {
        somme += NOTES[i].note;
    }

    const result = await db.execute({
        sql: `SELECT matricule, nom, prenom, age, classe FROM students WHERE id = ?`,
        args: [student_id]
    });

    return { ...result.rows[0], moyenne: somme / NOTES.length };
};

const meilleurEtudiant = async (subject_id) => {
    const result = await db.execute({
        sql: `SELECT DISTINCT student_id FROM grades WHERE subject_id = ?`,
        args: [subject_id]
    });
    const meilleur = result.rows;
    if (meilleur.length === 0) return null;

    let bestEtudiant = null;
    let meilleurMoyenne = 0;

    for (let i = 0; i < meilleur.length; i++) {
        const maMoyenne = await calculMoyenne(meilleur[i].student_id, subject_id);
        if (maMoyenne > meilleurMoyenne) {
            meilleurMoyenne = maMoyenne;
            bestEtudiant = meilleur[i].student_id;
        }
    }

    const matiere = await db.execute({ sql: `SELECT nom FROM subjects WHERE id = ?`, args: [subject_id] });
    const student = await db.execute({ sql: `SELECT matricule, nom, prenom FROM students WHERE id = ?`, args: [bestEtudiant] });

    return {
        student_id: bestEtudiant,
        Nom_Complet: `${student.rows[0].matricule} ${student.rows[0].prenom} ${student.rows[0].nom}`,
        matiere: matiere.rows[0].nom,
        maMoyenne: meilleurMoyenne
    };
};

const deleteGrades = async (id) => {
    return await db.execute({ sql: `DELETE FROM grades WHERE id = ?`, args: [id] });
};

export { addNoteGrade, updateGrades, deleteGrades, affGrades, getStudentGrades, getAllGradesByStudent, getGradesByTeacher, calculMoyenne, meilleurEtudiant }