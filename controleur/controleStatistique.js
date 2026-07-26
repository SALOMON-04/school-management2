import { moyenneGeneraleByStudent, moyenneGeneraleEcole, meilleurEtudiantParClasse, totalUsers, totalStudent, totalProfesseur } from "../services/servicesStatistiques.js";



const studentMoyenne = (req, res) => {

    const student_id = Number(req.params.student_id);

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


export { studentMoyenne, moyenneEcole, meilleurStudentParClasse, nombreUsers, nombreStudents, nombreTeacher };

