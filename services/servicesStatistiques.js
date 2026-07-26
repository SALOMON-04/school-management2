import db from "../db/database.js";

// MOI GENERALE D'UN ETUDIANT

const moyenneGeneraleByStudent = (student_id) => {



    // "AVG(note)" elle prend en compte toute les valeur de la colone note et calcul la moyenne directement
    // "AS" Ce mot-clé sert à donner un surnom (un alias) temporaire à une colonne dans le résultat final

    const resultat = db.prepare(`
             SELECT AVG(note) AS moyenne FROM grades
             WHERE student_id = ?
        `).get(student_id);



    // Vériffication de l'existance des note dans la colone

    if (resultat.moyenne === null) {
        console.log("Acunne note trouvé");
        return 0;
    }


    // Récupération des information de l'etudiant pour l'afficher

    const student = db.prepare(`
            SELECT matricule, nom, prenom, age, classe
            FROM students 
            WHERE id = ?
        `).get(student_id) ;


    return {
        ...student,
         moyenne: resultat.moyenne} ;
}




// LISTES DES MOYENNE DES MEILLEUR ETUDIANT DANS TOUTE LES MATIERE

const meilleurEtudiantParClasse = () => {

    // Récupère toutes les classes distinctes
    const classes = db.prepare(`SELECT DISTINCT classe FROM students`).all();

    // Tableau qui va contenir le résultat final : un objet par classe
    let resultatFinal = [];


    // On parcourt chaque classe une par une
    for (let i = 0; i < classes.length; i++) {

        const classeActuelle = classes[i].classe;

        // Récupère tous les étudiants de cette classe précise
        const etudiantsDeCetteClasse = db.prepare(`
            SELECT id, nom, prenom FROM students WHERE classe = ?
        `).all(classeActuelle);


        // Variables qui vont retenir le meilleur étudiant de CETTE classe
        let meilleurEtudiant = null;
        let meilleureMoyenne = 0;


        // On parcourt chaque étudiant de cette classe
        for (let j = 0; j < etudiantsDeCetteClasse.length; j++) {

            const etudiant = etudiantsDeCetteClasse[j];

            // On calcule sa moyenne générale (toutes matières confondues)
            const resultatMoyenne = moyenneGeneraleByStudent(etudiant.id);

            // moyenneGeneraleByStudent retourne soit 0 (aucune note),
            // soit un objet { ...infos, moyenne: ... }
            const sMoyenne = resultatMoyenne === 0 ? 0 : resultatMoyenne.moyenne;

            if (sMoyenne > meilleureMoyenne) {
                meilleureMoyenne = sMoyenne;
                meilleurEtudiant = etudiant;
            }
        }


        // On ajoute le résultat de cette classe au tableau final
        resultatFinal.push({
            classe: classeActuelle,
            meilleurEtudiant: meilleurEtudiant
                ? `${meilleurEtudiant.prenom} ${meilleurEtudiant.nom}`
                : "Aucun étudiant noté",
            moyenne: meilleureMoyenne
        });
    }


    return resultatFinal;
};




// MOYENNE GENERALE DE L'ECOLE

const moyenneGeneraleEcole = () => {


    // "AVG(note)" elle prend en compte toute les valeur de la colone note et calcul la moyenne directement
    // "AS" Ce mot-clé sert à donner un surnom (un alias) temporaire à une colonne dans le résultat final
    
    const resultats = db.prepare(`
           SELECT AVG(note) AS moyenneEcole
           FROM grades 
        `).get();


    // Vériffication de l'existance des note dans la colone
    
    if (resultats.moyenneEcole === null) {
        console.log("Acunne note trouvé");
        return 0;
    }

    return resultats.moyenneEcole;
}






// NOMBRE TOTAL D'UTILISATEUR


const totalUsers = () => {

    // COUNT(*) compte simplement le nombre total de lignes (d'enregistrements) qui existent dans le tableau, même si certaines cases sont vides.
    // "AS" Ce mot-clé sert à donner un surnom (un alias) temporaire à une colonne dans le résultat final

    const resultat = db.prepare(`
            SELECT COUNT(*) AS total FROM users
        `).get()

    return resultat ;

}



// NOMBRE TOTAL D'ETUDIANT 

const totalStudent = () => {


    // COUNT(*) compte simplement le nombre total de lignes (d'enregistrements) qui existent dans le tableau, même si certaines cases sont vides.
    // "AS" Ce mot-clé sert à donner un surnom (un alias) temporaire à une colonne dans le résultat final

    const resultat = db.prepare(`
            SELECT COUNT(*) AS total FROM students
        `).get();

    return resultat
};


// NOMBRE TOTAL DE PROFFESEUR 


const totalProfesseur = () => {


    // COUNT(*) compte simplement le nombre total de lignes (d'enregistrements) qui existent dans le tableau, même si certaines cases sont vides.
    // "AS" Ce mot-clé sert à donner un surnom (un alias) temporaire à une colonne dans le résultat final

    const resultat = db.prepare(`
           SELECT COUNT(*) AS total FROM teachers 
        `).get();

    return resultat
};


export {moyenneGeneraleByStudent, moyenneGeneraleEcole, meilleurEtudiantParClasse, totalUsers, totalStudent, totalProfesseur}