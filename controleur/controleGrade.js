import { addNoteGrade, updateGrades, deleteGrades, affGrades, getStudentGrades, calculMoyenne, meilleurEtudiant } from "../services/servicesGrades.js";




const ajoutGrades = (req, res) => {

    const {student_id, subject_id, note} = req.body;

    const notes = addNoteGrade(student_id, subject_id, note);


    if(notes.changes === 0){
        return res.status(404).json({error: "Une erreur est survenu lors de l'ajout de la note"});
    };


    return res.status(201).json({student_id, subject_id, note});
};


const modifGrades = (req, res) => {

    const id = Number(req.params.id);
    const data = req.body;

    const uptdate = updateGrades(id, data);

    if(uptdate.changes === 0){
        return res.status(404).json({error: "La modification de la noe a échoué"});
    };


    return res.status(200).json({
        id: id,
        student_id: data.student_id,
        subject_id: data.subject_id,
        note: data.note
    });

};



const seachGrades = (req, res) => {

    const afficher = affGrades();

    return res.status(200).json(afficher);
};


const seachGradesStudent = (req, res) =>  {

    const studentId = Number(req.params.studentId);
    const subjectId = Number(req.params.subjectId);

    const afficher = getStudentGrades(studentId, subjectId);

    if(afficher.length === 0){
        return res.status(404).json({error: "Les note de cet étudiant son introuvable"});
    };


    return res.status(200).json(afficher);

};

const moyenneStudent = (req, res) => {

    const studentId = Number(req.params.studentId);
    const subjectId = Number(req.params.subjectId);

    const afficher =  calculMoyenne(studentId, subjectId);

    if(afficher === 0){
        return res.status(404).json({error: "Les note de cet étudiant sont introuvables, la moyenne ne peut pas etre calculé"});
    };


    return res.status(200).json(afficher);

};



const supprimeGrades = (req, res) => {
    
    const id = Number(req.params.id);

    const supprime  = deleteGrades(id);

    if(supprime.changes === 0){
        return res.status(404).json({error: "Supression de l'absence impossible"});
    };

    
    return res.status(200).json(supprime);

};

export {ajoutGrades, modifGrades, seachGrades, seachGradesStudent, moyenneStudent, supprimeGrades };