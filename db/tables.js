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

db.execute(TableUsers);




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

db.execute(TableStudents)





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

db.execute(TableTeachers)




// TABLE D'ACCES LIMITE AU CLASSE PAR TEACHERS


const tableTeacher_classe = `
    CREATE TABLE IF NOT EXISTS  teacher_classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        teacher_id INTEGER NOT NULL,
        classe TEXT NOT NULL,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id),
        UNIQUE(teacher_id, classe)
    ) 
`;

db.execute(tableTeacher_classe);



// TABLE SUBJECTS

const TableSubjects = `
    CREATE TABLE IF NOT EXISTS subjects(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        teacher_id INTEGER,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id)
    )
`;

db.execute(TableSubjects)


  

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

db.execute(TableGrades)





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

db.execute(TableAbsence);






