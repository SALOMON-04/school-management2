import { assignClasse, retireClasse, getClasseByTeacher} from "../services/serviceTeachers_classes.js";



const classeAssigniger =  async (req, res) => {

    const {teacher_id,  classe} = req.body;

    const assigner = await assignClasse(teacher_id, classe);

    if(assigner.changes === 0){
        return res.status(404).json({error: "une erreur est survenu au moment de l'assignation"});
       
    };


    return res.status(201).json({teacher_id, classe});

}




const classeRetirer = async (req, res) => {

    const teacher_id = Number(req.params.teacher_id);
    const classe = req.params.classe;

    const retirer = await retireClasse(teacher_id, classe);

    if (retirer.changes === 0) {
        return res.status(404).json({ error: "Aucune assignation trouvée pour ce prof et cette classe" });
    };

    return res.status(200).json({ message: `Classe ${classe} retirée du prof ${teacher_id}` });
};


const afficherClassesTeacher = async (req, res) => {

    const teacher_id = Number(req.params.teacher_id);

    const classes = await getClasseByTeacher(teacher_id);

    return res.status(200).json(classes);
};


export { classeAssigniger, classeRetirer, afficherClassesTeacher };