import { createStudent, getAllStudents, getStudentById, getStudentByMatricule, updateStudent, choixEtudiant, deleteStudent } from "../services/servicesStudents.js";



const creationStudent = async (req, res) => {

    const { matricule, nom, prenom, age, classe, username, password } = req.body;

    const students = await createStudent(matricule, nom, prenom, age, classe, username, password);

    if(students?.erreur){
        return res.status(400).json({erreur: students.erreur});
    }else if (students.changes === 0) {
        return res.status(404).json({ erreur: "Une erreur est survenu lors de la création de l'etudiant" });
    };


    return res.status(201).json({matricule, nom, prenom, classe });
};




const seachStudent = (req, res) => {

    const afficher = getAllStudents();
    return res.status(200).json(afficher);

};




const seachStudentsId = (req, res) => {

    const id = Number(req.params.id);

    const student = getStudentById(id);

    if (!student) {
        return res.status(404).json("utilisateur introuvable");
    };

    return res.status(200).json(student);
};



const seachStudentsMatricule = (req, res) => {

    const matricule = req.params.matricule;

    const matStdent = getStudentByMatricule(matricule);

    if (!matStdent) {
        return res.status(404).json("utilisateur introuvable");
    };

    return res.status(200).json(matStdent);

}




const modifStudent = (req, res) => {

    const id = Number(req.params.id);
    const data = req.body;

    const update = updateStudent(id, data);

    if (update.changes === 0) {
        return res.status(404).json({ error: "Modiffication impossible utilisateur introuvable" });
    };


    return res.status(200).json({
        id: id,
        matricule: data.matricule,
        nom: data.nom,
        prenom: data.prenom,
        age: data.age,
        classe: data.classe,
        username: data.username

    });
};


const supprimeStudent = (req, res) => {

    const id = Number(req.params.id);

    const supprime = deleteStudent(id);

    if (supprime.changes === 0) {
        return res.status(404).json({ error: `l'utilisateur avec l'${id} est in trouvable` });
    };

    return res.status(200).json(`Utilisatuer suprimmer avec id ${id}`)
};



export { creationStudent, seachStudent, seachStudentsId, seachStudentsMatricule, modifStudent, supprimeStudent };