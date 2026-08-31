import db from "../db/database.js";
import { moyenneGeneraleByStudent, moyenneGeneraleEcole, meilleurEtudiantParClasse, totalUsers, totalStudent, totalProfesseur } from "../services/servicesStatistiques.js";
import { getStudentById } from "../services/servicesStudents.js";

const studentMoyenne = async (req, res) => {
    const student_id = Number(req.params.student_id);
    if (req.user.role === "etudiant") {
        const student = await getStudentById(student_id);
        if (!student || student.user_id !== req.user.id) {
            return res.status(403).json({ error: "Vous ne pouvez consulter que vos informations" });
        }
    }
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

const getStatsUsers = async (req, res) => {
    const total      = (await db.execute("SELECT COUNT(*) as n FROM users")).rows[0].n;
    const etudiants  = (await db.execute("SELECT COUNT(*) as n FROM users WHERE role = 'etudiant'")).rows[0].n;
    const professeurs= (await db.execute("SELECT COUNT(*) as n FROM users WHERE role = 'professeur'")).rows[0].n;
    const admins     = (await db.execute("SELECT COUNT(*) as n FROM users WHERE role = 'admin'")).rows[0].n;
    return res.status(200).json({ total, etudiants, professeurs, admins });
};

const getStatsStudents = async (req, res) => {
    const total   = (await db.execute("SELECT COUNT(*) as n FROM students")).rows[0].n;
    const classes = (await db.execute("SELECT COUNT(DISTINCT classe) as n FROM students")).rows[0].n;
    const moyenne = (await db.execute("SELECT ROUND(AVG(note), 2) as moy FROM grades")).rows[0].moy;
    return res.status(200).json({ total, classes, moyenne });
};

const getStatsProfesseurs = async (req, res) => {
    const total = (await db.execute("SELECT COUNT(*) as n FROM teachers")).rows[0].n;
    return res.status(200).json({ total });
};

const getStatsMatieres = async (req, res) => {
    const total     = (await db.execute("SELECT COUNT(*) as n FROM subjects")).rows[0].n;
    const assignees = (await db.execute("SELECT COUNT(*) as n FROM subjects WHERE teacher_id IS NOT NULL")).rows[0].n;
    const nonAssign = (await db.execute("SELECT COUNT(*) as n FROM subjects WHERE teacher_id IS NULL")).rows[0].n;
    return res.status(200).json({ total, assignees, nonAssign });
};

const getStatsNotes = async (req, res) => {
    const total     = (await db.execute("SELECT COUNT(*) as n FROM grades")).rows[0].n;
    const moyenne   = (await db.execute("SELECT ROUND(AVG(note), 2) as moy FROM grades")).rows[0].moy;
    const enDessous = (await db.execute("SELECT COUNT(*) as n FROM grades WHERE note < 10")).rows[0].n;
    return res.status(200).json({ total, moyenne, enDessous });
};

const getStatsAbsences = async (req, res) => {
    const total      = (await db.execute("SELECT COUNT(*) as n FROM absences")).rows[0].n;
    const justifiees = (await db.execute("SELECT COUNT(*) as n FROM absences WHERE status = 'justifiee'")).rows[0].n;
    const nonJust    = (await db.execute("SELECT COUNT(*) as n FROM absences WHERE status = 'non_justifiee'")).rows[0].n;
    const aujourdhui = (await db.execute("SELECT COUNT(*) as n FROM absences WHERE date(date) = date('now')")).rows[0].n;
    return res.status(200).json({ total, justifiees, nonJust, aujourdhui });
};

export { studentMoyenne, moyenneEcole, meilleurStudentParClasse, nombreUsers, getStatsUsers, getStatsStudents, getStatsProfesseurs, getStatsMatieres, getStatsNotes, nombreStudents, getStatsAbsences, nombreTeacher };