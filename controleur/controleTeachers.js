import { createTeacher, getAllTeacher, getAllTeacherAvecMatiere, getTeacherById, getTeacherByUser_id, updateTeacher, deleteTeacher } from "../services/servicesTeachers.js";




const creationTeacher = async (req, res) => {
    const {nom, subject_id, username, password} = req.body;

    const teacher = await createTeacher(nom, subject_id, username, password);

    if(teacher?.erreur){
        return res.status(400).json({erreur: teacher.erreur})
    }else if(teacher.changes === 0){
        return res.status(404).json({erreur: "Une erreur est survenu lors de la création du profésseur"});
    };


    return res.status(201).json({nom, subject_id, username});
};




const seachteacher = (req, res) => {

    const afficher = getAllTeacher();
    return res.status(200).json(afficher);
};



const seachteacherMatiere = (req, res) => {
    const matiere = req.params.matiere;

    const subject = getAllTeacherAvecMatiere(matiere);

    if(subject.length === 0){
        return res.status(404).json({error: "Aucun proffésseur associer a vette matière"});
    };

    return res.status(200).json(subject);

};




const seachteacherId  = (req, res) => {

    const id = Number(req.params.id);

    const teacher = getTeacherById(id);

    if(!teacher){
        return res.status(404).json({error: "Aucun proffesseur trouver"});
    };


    return res.status(200).json(teacher);
};




const seachteacherUser_id = (req, res) => {

   const user_id = Number(req.params.user_id);


    // Nouvelle vérification : si c'est un prof, il ne peut voir QUE ses propres infos
    if (req.user.role === "professeur" && req.user.id !== user_id) {
        return res.status(403).json({ error: "Vous ne pouvez consulter que vos propres informations." });
    }

    

   const user = getTeacherByUser_id(user_id);

   if(!user){
        return res.status(404).json({error: "Aucun proffesseur correspondant à ce Id trouver"});
    };


    return  res.status(200).json(user);

};




const modifTeacher = (req, res) => {

    const id = Number(req.params.id);

    const data = req.body;

    const update = updateTeacher(id, data);

    if(update.changes === 0){
        return res.status(404).json({error: "Modification impossible cet utilisateur"});
    };


    return res.status(200).json({

        id: id,
        nom: data.nom,
        subject_id: data.subject_id
        
    });
};




const supprimeTeacher  = (req, res) => {

    const id = Number(req.params.id);

    const supprime = deleteTeacher(id);

    if(supprime.changes === 0){
        return res.status(404).json({error: `l'utilisateur avec l'${id} est in trouvable` })
    };

    return res.status(200).json(`Utilisateur avec l' ${id}  a été suprimer`);
};



export {creationTeacher, seachteacher, seachteacherId, seachteacherUser_id, seachteacherMatiere, modifTeacher, supprimeTeacher};




