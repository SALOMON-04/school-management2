import { error } from "console";
import { createSubject, getAllSubjects, getSubjectById, updateASubject, choixMatiere, affectTeacherSubject, deleteSubject } from "../services/servicesSubjects.js";



const creationSubject = (req, res) => {

    const {nom} = req.body;
    const matiere = createSubject(nom);
    
    if(matiere.changes === 0){
        return res.status(404).json({error: "Une erreur est survenu lors de la création de la matière"})
    };

    return res.status(201).json({nom});
};



const seachSubject = (req, res) => {

    const afficher = getAllSubjects();
    return res.status(200).json(afficher);
};



const seachSubjectId = (req, res) => {

    const id = Number(req.params.id);

    const matiere = getSubjectById(id);


    if(!matiere){
        return res.status(404).json({error: `Aucune matière correspond a cet ${id}`})
    };

    return res.status(200).json(matiere)
};



const AffectSubject = (req, res) => {

    const subject_id = Number(req.params.subject_id);
    const teacher_id = Number(req.params.teacher_id); 

    const affectation = affectTeacherSubject(subject_id, teacher_id);

    if(affectation.changes === 0){
        return res.status(404).json({error: "Affectation de la matière impossible"});
    };


    return res.status(200).json({subject_id: subject_id, teacher_id: teacher_id});


};



const modifSubject = (req, res) => {
    const id = Number(req.params.id);

    const data = req.body;

    const uptdate = updateASubject(id, data);

    if(uptdate.changes === 0){
        return res.status(404).json({error: "La modification de cette matière a échoué"});
    };

    return res.status(200).json({id: id, nom: data.nom});
};




const supprimeSubject = (req, res) => {

    const id = Number(req.params.id);
    const supprime = deleteSubject(id);

    if(supprime.changes === 0){
        return res.status(404).json({error: `Suppression de la matière correspondant a l'${id} est impossible, veuillez rensseigner le bon id`});
    };


    return res.status(200).json("la matière  a été suppimé avec succès");

};




export {creationSubject, seachSubject, seachSubjectId, modifSubject, affectTeacherSubject, deleteSubject, supprimeSubject}