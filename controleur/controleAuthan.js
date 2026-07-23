import { getUserByUsername, getUserById } from "../services/servicesUsers.js";
import { getStudentByMatricule } from "../services/servicesStudents.js";
import { logger } from "../utils/logger.js";




export const connexion = (req, res) => {

    const { identifiant, matricule, password } = req.body;

    


    if (identifiant) {

        const user = getUserByUsername(identifiant, password);

        if (!user) {

            logger.warning(`l'${identifiant} ou ${password} n'est pas éligible `);

            return res.status(401).json({ error: " username ou mot de passe incorect" });

        }


        logger.info(`${user.nom} ${user.role} connecté`);

        return res.json({
            id: user.id,
            nom: user.nom,
            role: user.role
        });

    };


    if (matricule) {

        const student = getStudentByMatricule(matricule, password);

       if (!student){

         logger.warning(`l'${matricule} ou ${password} n'est pas éligible `);

        return res.status(401).json({ error: " matricul ou mot de passe incorect" });

       };

        logger.info(`${student.prenom} ${student.nom} ${student.classe} (student) connecté`);

        return res.json({
            id: student.id,
            user_id: student.user_id,
            nom: student.nom,
            prenom: student.prenom,
            classe: student.classe,
            role: "etudiant"
        });


    };


    return res.status(404).json({error: "veuiller fornir lesinformation demander "});

};




