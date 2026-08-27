import db from "../db/database.js";
import { moyenneGeneraleByStudent, moyenneGeneraleEcole, meilleurEtudiantParClasse, totalUsers, totalStudent, totalProfesseur } from "../services/servicesStatistiques.js";
import { getStudentById } from "../services/servicesStudents.js";



const studentMoyenne = async (req, res) => {

    const student_id = Number(req.params.student_id);


    if (req.user.role === "etudiant") {
        const student = await getStudentById(student_id);

        if (!student || student.user_id !== req.user.id) {
            return res.status(403).json({ error: "Vous ne pouver consulter que vos information" })
        };
    };

    const resultat = await moyenneGeneraleByStudent(student_id);


    return res.status(200).json(resultat);
};



const moyenneEcole = async (req, res) => {

    const resultat = await moyenneGeneraleEcole();

    return res.status(200).json({ moyenneEcole: resultat });
};



const meilleurStudentParClasse = async (req, res) => {

    const resultat = await meilleurEtudiantParClasse();

    return res.status(200).json(resultat);
};



const nombreUsers = async (req, res) => {

    const resultat = await totalUsers();


    return res.status(200).json(resultat);
};



const nombreStudents = async (req, res) => {

    const resultat = await totalStudent();

    return res.status(200).json(resultat);
};




const nombreTeacher = async (req, res) => {

    const resultat = await totalProfesseur();

    return res.status(200).json(resultat);
};




// Statistiques des utilisateurs par rôle
const getStatsUsers = async (req, res) => {
    const total = (await (await db.prepare("SELECT COUNT(*) as n FROM users")).get()).n;
    const etudiants = (await (await db.prepare("SELECT COUNT(*) as n FROM users WHERE role = 'etudiant'")).get()).n;
    const professeurs = (await (await db.prepare("SELECT COUNT(*) as n FROM users WHERE role = 'professeur'")).get()).n;
    const admins = (await (await db.prepare("SELECT COUNT(*) as n FROM users WHERE role = 'admin'")).get()).n;

    return res.status(200).json({ total, etudiants, professeurs, admins });
};




// Stats étudiants
const getStatsStudents = async (req, res) => {

    const total = (await (await db.prepare("SELECT COUNT(*) as n FROM students")).get()).n;
    const classes = (await (await db.prepare("SELECT COUNT(DISTINCT classe) as n FROM students")).get()).n;
    const moyenne = (await (await db.prepare("SELECT ROUND(AVG(note), 2) as moy FROM grades")).get()).moy;

    return res.status(200).json({ total, classes, moyenne });
};

// Stats professeurs
const getStatsProfesseurs = async (req, res) => {

    const total = (await (await db.prepare("SELECT COUNT(*) as n FROM teachers")).get()).n;

    return res.status(200).json({ total });
};

// Stats matières
const getStatsMatieres = async (req, res) => {
    const total = (await (await db.prepare("SELECT COUNT(*) as n FROM subjects")).get()).n;
    const assignees = (await (await db.prepare("SELECT COUNT(*) as n FROM subjects WHERE teacher_id IS NOT NULL")).get()).n;
    const nonAssign = (await (await db.prepare("SELECT COUNT(*) as n FROM subjects WHERE teacher_id IS NULL")).get()).n;

    return res.status(200).json({ total, assignees, nonAssign });
};

// Stats notes
const getStatsNotes = async (req, res) => {
    const total = (await (await db.prepare("SELECT COUNT(*) as n FROM grades")).get()).n;
    const moyenne = (await (await db.prepare("SELECT ROUND(AVG(note), 2) as moy FROM grades")).get()).moy;
    const meilleures = (await (await db.prepare("SELECT COUNT(*) as n FROM grades WHERE note = 20")).get()).n;
    const enDessous = (await (await db.prepare("SELECT COUNT(*) as n FROM grades WHERE note < 10")).get()).n;

    return res.status(200).json({ total, moyenne, meilleures, enDessous });
};

// Stats absences
const getStatsAbsences = async (req, res) => {
    const total = (await (await db.prepare("SELECT COUNT(*) as n FROM absences")).get()).n;
    const justifiees = (await (await db.prepare("SELECT COUNT(*) as n FROM absences WHERE status = 'justifiee'")).get()).n;
    const nonJust = (await (await db.prepare("SELECT COUNT(*) as n FROM absences WHERE status = 'non_justifiee'")).get()).n;
    const aujourdhui = (await (await db.prepare("SELECT COUNT(*) as n FROM absences WHERE date = date('now')")).get()).n;

    return res.status(200).json({ total, justifiees, nonJust, aujourdhui });
};


export { studentMoyenne, moyenneEcole, meilleurStudentParClasse, nombreUsers, getStatsUsers, getStatsStudents, getStatsProfesseurs, getStatsMatieres, getStatsNotes, nombreStudents, getStatsAbsences, nombreTeacher };