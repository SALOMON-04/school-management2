import db from "../db/database.js";
import { moyenneGeneraleByStudent, moyenneGeneraleEcole, meilleurEtudiantParClasse, totalUsers, totalStudent, totalProfesseur } from "../services/servicesStatistiques.js";
import { getStudentById } from "../services/servicesStudents.js";



const studentMoyenne = (req, res) => {

    const student_id = Number(req.params.student_id);


    if (req.user.role === "etudiant") {
        const student = getStudentById(student_id);

        if (!student || student.user_id !== req.user.id) {
            return res.status(403).json({ error: "Vous ne pouver consulter que vos information" })
        };
    };

    const resultat = moyenneGeneraleByStudent(student_id);


    return res.status(200).json(resultat);
};



const moyenneEcole = (req, res) => {

    const resultat = moyenneGeneraleEcole();

    return res.status(200).json({ moyenneEcole: resultat });
};



const meilleurStudentParClasse = (req, res) => {

    const resultat = meilleurEtudiantParClasse();

    return res.status(200).json(resultat);
};



const nombreUsers = (req, res) => {

    const resultat = totalUsers();


    return res.status(200).json(resultat);
};



const nombreStudents = (req, res) => {

    const resultat = totalStudent();

    return res.status(200).json(resultat);
};




const nombreTeacher = (req, res) => {

    const resultat = totalProfesseur();

    return res.status(200).json(resultat);
};




// Statistiques des utilisateurs par rôle
const getStatsUsers = (req, res) => {
    const total = db.prepare("SELECT COUNT(*) as n FROM users").get().n;
    const etudiants = db.prepare("SELECT COUNT(*) as n FROM users WHERE role = 'etudiant'").get().n;
    const professeurs = db.prepare("SELECT COUNT(*) as n FROM users WHERE role = 'professeur'").get().n;
    const admins = db.prepare("SELECT COUNT(*) as n FROM users WHERE role = 'admin'").get().n;

    return res.status(200).json({ total, etudiants, professeurs, admins });
};




// Stats étudiants
const getStatsStudents = (req, res) => {

    const total = db.prepare("SELECT COUNT(*) as n FROM students").get().n;

    return res.status(200).json({ total });
};

// Stats professeurs
const getStatsProfesseurs = (req, res) => {

    const total = db.prepare("SELECT COUNT(*) as n FROM teachers").get().n;

    return res.status(200).json({ total});
};

// Stats matières
const getStatsMatieres = (req, res) => {
    const total = db.prepare("SELECT COUNT(*) as n FROM subjects").get().n;
    const assignees = db.prepare("SELECT COUNT(*) as n FROM subjects WHERE teacher_id IS NOT NULL").get().n;
    const nonAssign = db.prepare("SELECT COUNT(*) as n FROM subjects WHERE teacher_id IS NULL").get().n;

    return res.status(200).json({ total, assignees, nonAssign });
};

// Stats notes
const getStatsNotes = (req, res) => {
    const total = db.prepare("SELECT COUNT(*) as n FROM grades").get().n;
    const moyenne = db.prepare("SELECT ROUND(AVG(note), 2) as moy FROM grades").get().moy;
    const meilleures = db.prepare("SELECT COUNT(*) as n FROM grades WHERE note = 20").get().n;
    const enDessous = db.prepare("SELECT COUNT(*) as n FROM grades WHERE note < 10").get().n;

    return res.status(200).json({ total, moyenne, meilleures, enDessous });
};

// Stats absences
const getStatsAbsences = (req, res) => {
    const total = db.prepare("SELECT COUNT(*) as n FROM absences").get().n;
    const justifiees = db.prepare("SELECT COUNT(*) as n FROM absences WHERE status = 'justifiee'").get().n;
    const nonJust = db.prepare("SELECT COUNT(*) as n FROM absences WHERE status = 'non_justifiee'").get().n;
    const aujourdhui = db.prepare("SELECT COUNT(*) as n FROM absences WHERE date = date('now')").get().n;

    return res.status(200).json({ total, justifiees, nonJust, aujourdhui });
};


export { studentMoyenne, moyenneEcole, meilleurStudentParClasse, nombreUsers, getStatsUsers, getStatsStudents, getStatsProfesseurs, getStatsMatieres, getStatsNotes, nombreStudents, getStatsAbsences, nombreTeacher };

