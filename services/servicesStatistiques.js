import db from "../db/database.js";

const moyenneGeneraleByStudent = async (student_id) => {

    const resultat = await (await db.prepare(`
             SELECT AVG(note) AS moyenne FROM grades
             WHERE student_id = ?
        `)).get(student_id);

    if (resultat.moyenne === null) {
        return 0;
    }

    const student = await (await db.prepare(`
            SELECT matricule, nom, prenom, age, classe
            FROM students 
            WHERE id = ?
        `)).get(student_id);

    return { ...student, moyenne: resultat.moyenne };
}


const meilleurEtudiantParClasse = async () => {

    const classes = await (await db.prepare(`SELECT DISTINCT classe FROM students`)).all();

    let resultatFinal = [];

    for (let i = 0; i < classes.length; i++) {

        const classeActuelle = classes[i].classe;

        const etudiantsDeCetteClasse = await (await db.prepare(`
            SELECT id, nom, prenom FROM students WHERE classe = ?
        `)).all(classeActuelle);

        let meilleurEtudiant = null;
        let meilleureMoyenne = 0;

        for (let j = 0; j < etudiantsDeCetteClasse.length; j++) {

            const etudiant = etudiantsDeCetteClasse[j];
            const resultatMoyenne = await moyenneGeneraleByStudent(etudiant.id);
            const sMoyenne = resultatMoyenne === 0 ? 0 : resultatMoyenne.moyenne;

            if (sMoyenne > meilleureMoyenne) {
                meilleureMoyenne = sMoyenne;
                meilleurEtudiant = etudiant;
            }
        }

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


const moyenneGeneraleEcole = async () => {

    const resultats = await (await db.prepare(`
           SELECT AVG(note) AS moyenneEcole
           FROM grades 
        `)).get();

    if (resultats.moyenneEcole === null) {
        return 0;
    }

    return resultats.moyenneEcole;
}


const totalUsers = async () => {
    return await (await db.prepare(`SELECT COUNT(*) AS total FROM users`)).get();
}


const totalStudent = async () => {
    return await (await db.prepare(`SELECT COUNT(*) AS total FROM students`)).get();
};


const totalProfesseur = async () => {
    return await (await db.prepare(`SELECT COUNT(*) AS total FROM teachers`)).get();
};


export { moyenneGeneraleByStudent, moyenneGeneraleEcole, meilleurEtudiantParClasse, totalUsers, totalStudent, totalProfesseur }