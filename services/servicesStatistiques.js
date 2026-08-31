import db from "../db/database.js";

const moyenneGeneraleByStudent = async (student_id) => {
    const result = await db.execute({
        sql: `SELECT AVG(note) AS moyenne FROM grades WHERE student_id = ?`,
        args: [student_id]
    });
    if (result.rows[0].moyenne === null) return 0;

    const student = await db.execute({
        sql: `SELECT matricule, nom, prenom, age, classe FROM students WHERE id = ?`,
        args: [student_id]
    });

    return { ...student.rows[0], moyenne: result.rows[0].moyenne };
};

const meilleurEtudiantParClasse = async () => {
    const classes = await db.execute(`SELECT DISTINCT classe FROM students`);
    let resultatFinal = [];

    for (let i = 0; i < classes.rows.length; i++) {
        const classeActuelle = classes.rows[i].classe;

        const etudiants = await db.execute({
            sql: `SELECT id, nom, prenom FROM students WHERE classe = ?`,
            args: [classeActuelle]
        });

        let meilleurEtudiant = null;
        let meilleureMoyenne = 0;

        for (let j = 0; j < etudiants.rows.length; j++) {
            const etudiant = etudiants.rows[j];
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
    const result = await db.execute(`SELECT AVG(note) AS moyenneEcole FROM grades`);
    return result.rows[0].moyenneEcole ?? 0;
};

const totalUsers = async () => {
    const result = await db.execute(`SELECT COUNT(*) AS total FROM users`);
    return result.rows[0];
};

const totalStudent = async () => {
    const result = await db.execute(`SELECT COUNT(*) AS total FROM students`);
    return result.rows[0];
};

const totalProfesseur = async () => {
    const result = await db.execute(`SELECT COUNT(*) AS total FROM teachers`);
    return result.rows[0];
};

export { moyenneGeneraleByStudent, moyenneGeneraleEcole, meilleurEtudiantParClasse, totalUsers, totalStudent, totalProfesseur }