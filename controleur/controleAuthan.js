import { getUserByUsername, getUserById } from "../services/servicesUsers.js";
import { getStudentByMatricule } from "../services/servicesStudents.js";
import { logger } from "../utils/logger.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";




export const connexion = async (req, res) => {

    const { identifiant, matricule, password } = req.body;




    if (identifiant) {



        const user = getUserByUsername(identifiant);

        if (!user) {

            logger.warning(`l'${identifiant} ou ${password} n'est pas éligible `);

            return res.status(401).json({ error: " username ou mot de passe incorect" });

        }



        // comparaison du mot de passe entré et le hesh dans notre bd

        const comparePasswordUser = await bcrypt.compare(password, user.password);  // Comparaison du hash avec le vrai password

        if (!comparePasswordUser) {

            logger.warning(`Mot de passe incorrect pour ${identifiant}`);
            return res.status(401).json({ error: "username ou mot de passe incorrect" });

        }

        logger.info(`${user.nom} ${user.role} connecté`);


        // Création du token JWT : contient l'id et le rôle, signé avec ta clé secrète
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );


        return res.json({
            id: user.id,
            nom: user.nom,
            role: user.role,
            token: token
        });

    };




    if (matricule) {

        const student = getStudentByMatricule(matricule);

        if (!student) {

            logger.warning(`l'${matricule} n'est pas éligible `);

            return res.status(401).json({ error: " matricul ou mot de passe incorect" });

        };


        // Verification du mot de passe de l'etudiant
        const user = getUserById(student.user_id);


        if (!user) {

            logger.warning(`l'${matricule} ou ${password} n'est pas éligible `);

            return res.status(401).json({ error: " username ou mot de passe incorect" });

        }

        // comparaison du mot de passe entré et le hesh dans notre bd

        const compareStudentPassword = await bcrypt.compare(password, user.password);  // Comparaison du hash avec le vrai password

        if (!compareStudentPassword) {

            logger.warning(`Mot de passe incorrect pour ${matricule}`);
            return res.status(401).json({ error: "username ou mot de passe incorrect" });

        }



        logger.info(`${student.prenom} ${student.nom} ${student.classe} est connecté`);


        // Création du token JWT : contient l'id et le rôle, signé avec ta clé secrète
        const token = jwt.sign(
            { id: student.user_id, role: "etudiant" },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );



        return res.json({
            id: student.id,
            user_id: student.user_id,
            nom: student.nom,
            prenom: student.prenom,
            classe: student.classe,
            role: "etudiant",
            token: token
        });


    };


    return res.status(404).json({ error: "veuiller fornir les information demander " });

};




