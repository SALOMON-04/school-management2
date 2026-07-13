import express from "express";
import { getUserByUsername, getUserById } from "../services/servicesUsers.js";
import { getStudentByMatricule } from "../services/servicesStudents.js";
import { logger } from "../utils/logger.js";
import { error, log } from "console";

const router = express.Router();




// CONNEXION DU PROF ET L'ADMIN

router.post("/login", (req, res) => {
    
    const {username, password, role} = req.body ;

    const user =  getUserByUsername(username, password);


    if(!user){
        logger.warning(`le ${username} n'est pas éligible au role choisis`);

        return res.status(401).json({ error : " username ou mot de passe incorect"})
    };



    if (role !== role ){
        logger.warning(`${username} n'est pas un ${role}`);

        res.status(403).json({error : `Compte n'est pas un ${role}`})
    };


    logger.info(`${user.nom} (${user.role}) connecté`);


    // On renvoie les infos utiles au frontend (jamais le mot de passe !)
    return res.json({
        id: user.id,
        nom: user.nom,
        role: user.role
    });



});




// CONNEXION DE L'ETUDIANT


router.post("/login-etudiant", (req, res) => {

    const { matricule, password } = req.body;

    const etudiant = getStudentByMatricule(matricule);

    if (!etudiant) {
        logger.warning(`Connexion échoué du Matricule : ${matricule}`);
        return res.status(401).json({ error: "Matricule incorrect." });
    }

    const user = getUserById(etudiant.user_id);

    if (!user || user.password !== password) {
        logger.warning(`Mot de passe incorrect pour l'étudiant au matricule: ${matricule}`);
        return res.status(401).json({ error: "Mot de passe incorrect." });
    }

    logger.info(`${etudiant.prenom} ${etudiant.nom} (etudiant) connecté`);

    return res.json({
        id: etudiant.id,
        user_id: user.id,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        classe: etudiant.classe,
        role: "etudiant"
    });
});




export default router ;

