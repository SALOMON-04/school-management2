import db from "../db/database.js";
import Absence from "../models/modelsAbsence.js";
import { getAllStudents } from "./servicesStudents.js";
import { getClasseByTeacher } from "./serviceTeachers_classes.js";

const createAbsence = async (student_id, date, status) => {
    const appAbscence = new Absence(student_id, date, status);
    return await db.execute({
        sql: `INSERT INTO absences (student_id, date, status) VALUES(?, ?, ?)`,
        args: [appAbscence.student_id, appAbscence.date, appAbscence.status]
    });
};

const getAllAbscence = async () => {
    const result = await db.execute(`
        SELECT absences.id, absences.student_id, absences.date, absences.status,
               students.nom, students.prenom, students.classe
        FROM absences
        LEFT JOIN students ON absences.student_id = students.id
    `);
    return result.rows;
};

const getAbsenceById = async (id) => {
    const result = await db.execute({
        sql: `SELECT * FROM absences WHERE id = ?`,
        args: [id]
    });
    return result.rows[0];
};

const getAbsencesByTeacher = async (teacher_id) => {
    const classesRows = await getClasseByTeacher(teacher_id);
    const classes = classesRows.map((c) => c.classe);
    if (classes.length === 0) return [];
    const allStudents = await getAllStudents();
    const students = allStudents.filter((s) => classes.includes(s.classe));
    const studentIds = students.map((s) => s.id);
    const allAbsences = await getAllAbscence();
    return allAbsences.filter((a) => studentIds.includes(a.student_id));
};

const updateAbsence = async (id, data) => {
    return await db.execute({
        sql: `UPDATE absences SET date = ?, status = ? WHERE id = ?`,
        args: [data.date, data.status, id]
    });
};

const deleteAbsence = async (id) => {
    return await db.execute({ sql: `DELETE FROM absences WHERE id = ?`, args: [id] });
};

const nombreAbsences = async (studentId) => {
    const result = await db.execute({
        sql: `SELECT COUNT(*) AS total FROM absences WHERE student_id = ? AND status = ?`,
        args: [studentId, "non_justifiee"]
    });
    return result.rows[0].total;
};

const getStudentAbsences = async (studentId) => {
    const result = await db.execute({
        sql: `SELECT * FROM absences WHERE student_id = ?`,
        args: [studentId]
    });
    return result.rows;
};

export { createAbsence, getAllAbscence, getAbsenceById, getAbsencesByTeacher, updateAbsence, deleteAbsence, nombreAbsences, getStudentAbsences }