import readline from "readline"; // "readline" va nous permettre de lire ce l'utilisateur va entré dans le terminale

import { getUserByUsername, getUserById } from "../services/servicesUsers.js";
import { getStudentByMatricule } from "../services/servicesStudents.js";
import { logger } from "../utils/logger.js";



// on va créer l'interface afin de pourvoir entré quelque chose et le reçevoir (inpunt et output)

const reponse = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


// cette ligne nous permet  de poser une question à 
// l'utilisateur et de recevoir une reponse

const question = (texte) => new Promise(resolve => reponse.question(texte, resolve));


const fermer = () => reponse.close();



// CONNEXION ADMIN ET PROFFESSEUR

const connexionUser = async (role) => {

    const username = await question("Username : ");

    const password = await question("Mot de passe : ");

    const user = getUserByUsername(username, password);


    // c'est condition vériffie l'existance de l'utilisateur,
    // son role te ses information

    if (!user) {
        logger.warning(`La connexion de ${username} a échouée`);
        console.log("Username ou mot de passe incorrect.");
        return null;
    }


    if (user.role !== role) {
        logger.warning(`${username} a essayé de se connecter en tant que ${role} mais est un ${user.role}`);
        console.log(`Ce compte n'est pas un ${role}.`);
        return null;
    }


    logger.info(`${user.nom} (${user.role}) connecté`);
    console.log(` Connecté : ${user.nom}`);
    return user;
};




// CONNEXION ETUDIANT

const connexionEtudiant = async () => {

    const matricule = await question("Matricule: ");
    const password = await question("Mot de passe : ");

    const etudiant = getStudentByMatricule(matricule);


    // c'est condition vériffie l'existance de l'étudiant,
    // son matricule te ses information

    if (!etudiant) {
        logger.warning(`Connexion échoué matricule: ${matricule} `);
        console.log("Matricule incorrect.");
        return null;
    }




    // Récupération de l'utilisateur lié a l'étudiant récherché
    const user = getUserById(etudiant.user_id);

    if (!user || user.password !== password) {
        logger.warning(`Mot de passe incorrect pour l'étudiant au matricule: ${matricule}`);
        console.log("Mot de passe incorrect.");
        return null;
    }

    logger.info(`${etudiant.prenom} ${etudiant.nom} (etudiant) connecté`);
    console.log(` Connecté : ${etudiant.nom}  ${etudiant.prenom}`);
    return etudiant;
};




export { question, fermer, connexionUser, connexionEtudiant };