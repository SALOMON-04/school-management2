import db from "../db/database.js";



const assignClasse = async (teacher_id, classe) => {

    const insertClasse = await db.prepare(`
            INSERT OR IGNORE INTO teacher_classes(teacher_id, classe)
            VALUES(?, ?)
        `);

        return await insertClasse.run(teacher_id, classe);
};



const retireClasse = async (teacher_id, classe)  => {

    const suprimer = await db.prepare(`
            DELETE FROM teacher_classes
            WHERE teacher_id = ? AND classe = ?
        `);

        return await suprimer.run(teacher_id, classe);
};



const getClasseByTeacher = async (teacher_id) => {

    return await (await db.prepare(`
            SELECT * FROM teacher_classes
            WHERE teacher_id = ?
        `)).all(teacher_id)
};


export {assignClasse, retireClasse, getClasseByTeacher}