import "dotenv/config";

import db from "./db/database.js";

import { createUser } from "./services/servicesUsers.js";
import { createTeacher, getAllTeacher } from "./services/servicesTeachers.js";
import { createStudent, getStudentByMatricule } from "./services/servicesStudents.js";
import { createSubject, getAllSubjects } from "./services/servicesSubjects.js";
import { addNoteGrade } from "./services/servicesGrades.js";
import { createAbsence } from "./services/servicesAbsences.js";
import { assignClasse } from "./services/serviceTeachers_classes.js";


const seed = async () => {

    console.log("--- Nettoyage de la base ---");

    await (await db.prepare(`DELETE FROM grades`)).run();
    await (await db.prepare(`DELETE FROM absences`)).run();
    await (await db.prepare(`DELETE FROM teacher_classes`)).run();
    await (await db.prepare(`DELETE FROM students`)).run();
    await (await db.prepare(`DELETE FROM subjects`)).run();
    await (await db.prepare(`DELETE FROM teachers`)).run();
    await (await db.prepare(`DELETE FROM users`)).run();

    console.log("Base nettoyée avec succès.\n");


    console.log("--- Création des matières ---");
    await createSubject("Mathématiques");
    await createSubject("Français");
    const subjects = await getAllSubjects();
    console.log(subjects, "\n");


    console.log("--- Création de l'admin ---");
    await createUser("Admin Principal", "admin", "admin1", "monMotDePasse123");
    console.log("");


    console.log("--- Création des professeurs ---");
    await createTeacher("Kouassi Jean", subjects[0].id, "jkouassi", "kouaJea123");
    await createTeacher("Traore Fatou", subjects[1].id, "ftraore", "trao123Fa");
    const teachers = await getAllTeacher();
    console.log(teachers, "\n");


    console.log("--- Assignation des classes aux profs ---");
    await assignClasse(teachers[0].id, "3eme A");
    await assignClasse(teachers[1].id, "3eme A");
    console.log("Classes assignées.\n");


    console.log("--- Création des étudiants ---");
    await createStudent("MAT001", "Koffi", "Awa", 15, "3eme A", "akoffi", "kof123Awa");
    await createStudent("MAT002", "Diallo", "Ali", 16, "3eme A", "adiallo", "dial123Al");

    const student1 = await getStudentByMatricule("MAT001");
    const student2 = await getStudentByMatricule("MAT002");
    console.log(student1, student2, "\n");


    console.log("--- Ajout des notes ---");
    await addNoteGrade(student1.id, subjects[0].id, 15);
    await addNoteGrade(student1.id, subjects[0].id, 12);
    await addNoteGrade(student1.id, subjects[0].id, 18);
    await addNoteGrade(student1.id, subjects[1].id, 14);
    await addNoteGrade(student2.id, subjects[0].id, 10);
    await addNoteGrade(student2.id, subjects[0].id, 13);

    console.log("Notes ajoutées.\n");


    console.log("--- Ajout des absences ---");
    await createAbsence(student1.id, "2026-08-20 08:00:00", "non_justifiee");
    await createAbsence(student2.id, "2026-08-20 08:00:00", "justifiee");
    await createAbsence(student2.id, "2026-08-21 08:00:00", "non_justifiee");

    console.log("Absences ajoutées.\n");


    console.log("=== SEED TERMINÉ AVEC SUCCÈS ===");
    console.log("Comptes créés avec les mots de passe définis dans ce script.");
};


seed();