import db from "./database.js";

// TABLE USERS

const TableUsers = `
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    role TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
    )
` ;

db.exec(TableUsers);




// TABLE STUDENTS

const TableStudents = `
    CREATE TABLE IF NOT EXISTS students(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        matricule TEXT UNIQUE NOT NULL,
        nom TEXT NOT NULL,
        prenom TEXT NOT NULL,
        age INTEGER NOT NULL,
        classe TEXT NOT NULL,
        user_id INTEGER UNIQUE,
        FOREIGN KEY (user_id)  REFERENCES users(id)
    )
` ;

db.exec(TableStudents)





// TABLES TEACHERS

const TableTeachers = `
    CREATE TABLE IF NOT EXISTS teachers(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        subject_id INTEGER,
        user_id INTEGER UNIQUE,
        FOREIGN KEY (user_id) REFERENCES users(id)

    )
` ;

db.exec(TableTeachers)





// TABLE SUBJECTS

const TableSubjects = `
    CREATE TABLE IF NOT EXISTS subjects(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        teacher_id INTEGER,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id)
    )
`;

db.exec(TableSubjects)


  

// TABLE GRADES

const TableGrades = `
    CREATE TABLE IF NOT EXISTS grades(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        subject_id INTEGER NOT NULL,
        note REAL NOT NULL CHECK(note >= 0 AND note <= 20),
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
    )
`;

db.exec(TableGrades)





// TABLE ABSENCE

const TableAbsence = `
    CREATE TABLE IF NOT EXISTS absences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL ,
        FOREIGN KEY (student_id) REFERENCES students(id)
    )
` ;

db.exec(TableAbsence);






