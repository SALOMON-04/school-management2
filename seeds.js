import db from "./db/database.js";
import "./db/tables.js"; // s'assure que les tables existent

import { createUser } from "./services/servicesUsers.js";
import { createTeacher, getAllTeacher } from "./services/servicesTeachers.js";
import { createStudent, getStudentByMatricule } from "./services/servicesStudents.js";
import { createSubject, getAllSubjects } from "./services/servicesSubjects.js";
import { addNoteGrade } from "./services/servicesGrades.js";
import { createAbsence } from "./services/servicesAbsences.js";


const seed = async () => {

    console.log("--- Nettoyage de la base ---");

    // Ordre important : on supprime d'abord les tables qui dépendent des autres
    // (à cause des FOREIGN KEY), sinon SQLite refuse la suppression
    db.prepare(`DELETE FROM grades`).run();
    db.prepare(`DELETE FROM absences`).run();
    db.prepare(`DELETE FROM students`).run();
    db.prepare(`DELETE FROM teachers`).run();
    db.prepare(`DELETE FROM subjects`).run();
    db.prepare(`DELETE FROM users`).run();

    console.log("Base nettoyée avec succès.\n");


    console.log("--- Création des matières ---");
    createSubject("Mathématiques");
    createSubject("Français");
    const subjects = getAllSubjects();
    console.log(subjects, "\n");


    console.log("--- Création de l'admin ---");
    await createUser("Admin Principal", "admin", "admin1", "monMotDePasse123");
    console.log("");


    console.log("--- Création des professeurs ---");
    await createTeacher("Kouassi Jean", subjects[0].id, "jkouassi", "kouaJea123");   // Prof de Mathématiques
    await createTeacher("Traore Fatou", subjects[1].id, "ftraore", "trao123Fa");    // Prof de Français
    const teachers = getAllTeacher();
    console.log(teachers, "\n");


    console.log("--- Création des étudiants ---");
    await createStudent("MAT001", "Koffi", "Awa", 15, "3eme A", "akoffi", "kof123Awa");
    await createStudent("MAT002", "Diallo", "Ali", 16, "3eme A", "adiallo", "dial123Al");

    const student1 = getStudentByMatricule("MAT001");
    const student2 = getStudentByMatricule("MAT002");
    console.log(student1, student2, "\n");


    console.log("--- Ajout des notes ---");
    // Notes de l'étudiant 1 en Mathématiques
    addNoteGrade(student1.id, subjects[0].id, 15);
    addNoteGrade(student1.id, subjects[0].id, 12);
    addNoteGrade(student1.id, subjects[0].id, 18);

    // Notes de l'étudiant 1 en Français
    addNoteGrade(student1.id, subjects[1].id, 14);

    // Notes de l'étudiant 2 en Mathématiques
    addNoteGrade(student2.id, subjects[0].id, 10);
    addNoteGrade(student2.id, subjects[0].id, 13);

    console.log("Notes ajoutées.\n");


    console.log("--- Ajout des absences ---");
    createAbsence(student1.id, "Non justifié");
    createAbsence(student2.id, "Justifié");
    createAbsence(student2.id, "Non justifié");

    console.log("Absences ajoutées.\n");


    console.log("=== SEED TERMINÉ AVEC SUCCÈS ===");
    console.log("Comptes créés avec les mots de passe définis dans ce script.");
};


seed();