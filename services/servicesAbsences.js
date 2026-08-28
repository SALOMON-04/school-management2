import db from "../db/database.js";
import Absence from "../models/modelsAbsence.js"

import { getAllStudents } from "./servicesStudents.js";
import { getClasseByTeacher } from "../services/serviceTeachers_classes.js"


const createAbsence = async (student_id, status) => {

    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const appAbscence = new Absence(student_id, date, status);

    const insertAbscence = await db.prepare(`
            INSERT INTO absences (student_id, date, status)
            VALUES(?, ?, ?)
        `)

    return await insertAbscence.run(appAbscence.student_id, appAbscence.date, appAbscence.status)
};


const getAllAbscence = async () => {
    return await (await db.prepare(`
        SELECT 
            absences.id,
            absences.student_id,
            absences.date,
            absences.status,
            students.nom,
            students.prenom,
            students.classe
        FROM absences
        LEFT JOIN students ON absences.student_id = students.id
    `)).all();
};


const getAbsenceById = async (id) => {
    return await (await db.prepare(`
            SELECT * FROM absences
            WHERE id = ?
        `)).get(id);
};


const getAbsencesByTeacher = async (teacher_id) => {

    const classesRows = await getClasseByTeacher(teacher_id);
    const classes = classesRows.map((c) => c.classe);
    if (classes.length === 0) return [];

    const allStudents = await getAllStudents();
    const students = allStudents.filter((s) => classes.includes(s.classe));
    const studentIds = students.map((s) => s.id);

    const allAbsences = await getAllAbscence();
    const absences = allAbsences.filter((a) => studentIds.includes(a.student_id));

    return absences;
};


const updateAbsence = async (id, data) => {

    const updateTeacherStmt = await db.prepare(`
        UPDATE absences SET student_id = ?,
        date = ?,
        status = ?
        WHERE id = ?
    `);

    return await updateTeacherStmt.run([data.student_id, data.date, data.status, id]);
};


const deleteAbsence = async (id) => {
    return await (await db.prepare(`
            DELETE FROM absences WHERE id = ?
        `)).run(id);
};


const nombreAbsences = async (studentId) => {

    const result = await (await db.prepare(`
        SELECT COUNT(*) AS total
        FROM absences
        WHERE student_id = ?
        AND status = ?
    `)).get(studentId, "Non justifié");

    return result.total;
};


const getStudentAbsences = async (studentId) => {
    return await (await db.prepare(`
            SELECT * FROM absences
            WHERE student_id = ?
        `)).all(studentId);
};


export { createAbsence, getAllAbscence, getAbsenceById, getAbsencesByTeacher, updateAbsence, deleteAbsence, nombreAbsences, getStudentAbsences }