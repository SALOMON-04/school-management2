import { assignClasse, retireClasse, getClasseByTeacher} from "../services/serviceTeachers_classes.js";



const classeAssigniger =  (req, res) => {

    const {teacher_id,  classe} = req.body;

    const assigner = assignClasse(teacher_id, classe);

    if(assigner.changes === 0){
        return res.status(404).json({error: "une erreur est survenu au moment de l'assignation"});
       
    };


    return res.status(201).json({teacher_id, classe});

}




const classeRetirer = (req, res) => {

    const teacher_id = Number(req.params.teacher_id);
    const classe = req.params.classe;

    const retirer = retirerClasse(teacher_id, classe);

    if (retirer.changes === 0) {
        return res.status(404).json({ error: "Aucune assignation trouvée pour ce prof et cette classe" });
    };

    return res.status(200).json({ message: `Classe ${classe} retirée du prof ${teacher_id}` });
};


const afficherClassesTeacher = (req, res) => {

    const teacher_id = Number(req.params.teacher_id);

    const classes = getClasseByTeacher(teacher_id);

    return res.status(200).json(classes);
};


export { classeAssigniger, classeRetirer, afficherClassesTeacher };