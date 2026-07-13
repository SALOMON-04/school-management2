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




// MOYENNE GENERALE D'UN ETUDIANT DANS TOUTE LES MATIERE

const moyenneGeneralEtuddiant = () => {


    // Selectionner les étudiant de manière unique (DISTINCT)
    // afin de parcourrir leur information de manière spécifique

    const student = db.prepare(`
            select DISTINCT student_id
            FROM grades
        `).all()


    if (student.length === 0) {
        console.log("Aucun étudiant trouver")
    }


    // les varible qui vont recevoir l'id 
    // de l'étudiant et sa moyenne en fonction de la matière

    let meilleurStudent = null;
    let meilleurMoyenne = 0;


    // Cette boucle parcour la liste des etudiant dans
    // la table grades en comparant leur moyenne 

    for (let i = 0; i < student.length; i++) {

        const moyenne = moyenneGeneraleByStudent(student[i].student_id)

        if (moyenne > meilleurMoyenne) {
            meilleurMoyenne = moyenne;
            meilleurStudent = student[i].student_id;
        };
    };


    // récupérer les infos complètes de l'étudiant

    const infosEtudiant = db.prepare(`
        SELECT matricule, nom, prenom, age, classe
        FROM students
        WHERE id = ?
    `).get(meilleurStudent);


    return {  student_id: meilleurStudent, infosEtudiant, moyenne: meilleurMoyenne }
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


export {moyenneGeneraleByStudent, moyenneGeneraleEcole, moyenneGeneralEtuddiant, totalUsers, totalStudent, totalProfesseur}