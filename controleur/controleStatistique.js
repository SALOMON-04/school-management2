import db from "../db/database.js";
import { moyenneGeneraleByStudent, moyenneGeneraleEcole, meilleurEtudiantParClasse, totalUsers, totalStudent, totalProfesseur } from "../services/servicesStatistiques.js";
import { getStudentById } from "../services/servicesStudents.js";



const studentMoyenne = (req, res) => {

    const student_id = Number(req.params.student_id);


    if(req.user.role  === "etudiant"){
        const student = getStudentById(student_id);

        if(!student || student.user_id !== req.user.id){
            return res.status(403).json({error: "Vous ne pouver consulter que vos information"})
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
    const total      = db.prepare("SELECT COUNT(*) as n FROM users").get().n;
    const etudiants  = db.prepare("SELECT COUNT(*) as n FROM users WHERE role = 'etudiant'").get().n;
    const professeurs= db.prepare("SELECT COUNT(*) as n FROM users WHERE role = 'professeur'").get().n;
    const admins     = db.prepare("SELECT COUNT(*) as n FROM users WHERE role = 'admin'").get().n;

    return res.status(200).json({ total, etudiants, professeurs, admins });
};


export { studentMoyenne, moyenneEcole, meilleurStudentParClasse, nombreUsers, getStatsUsers , nombreStudents, nombreTeacher };

