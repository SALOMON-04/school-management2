import db from "../db/database.js";








const assignClasse = (teacher_id, classe) => {

    const insertClasse = db.prepare(`
            INSERT OR IGNORE INTO teacher_classes(teacher_id, classe)
            VALUES(?, ?)
        `);

        return insertClasse.run(teacher_id, classe);
};





const retireClasse = (teacher_id, classe)  => {

    const suprimer = db.prepare(`
            DELETE FROM teacher_classes
            WHERE teacher_id = ? AND classe = ?
        `);

        return suprimer.run(teacher_id, classe);
};



const getClasseByTeacher = (teacher_id) => {

    return db.prepare(`
            SELECT * FROM teacher_classes
            WHERE teacher_id = ?
        `).all(teacher_id)
};


export {assignClasse,  retireClasse, getClasseByTeacher}