import db from "../db/database.js";

const assignClasse = async (teacher_id, classe) => {
    return await db.execute({
        sql: `INSERT OR IGNORE INTO teacher_classes(teacher_id, classe) VALUES(?, ?)`,
        args: [teacher_id, classe]
    });
};

const retireClasse = async (teacher_id, classe) => {
    return await db.execute({
        sql: `DELETE FROM teacher_classes WHERE teacher_id = ? AND classe = ?`,
        args: [teacher_id, classe]
    });
};

const getClasseByTeacher = async (teacher_id) => {
    const result = await db.execute({
        sql: `SELECT * FROM teacher_classes WHERE teacher_id = ?`,
        args: [teacher_id]
    });
    return result.rows;
};

export { assignClasse, retireClasse, getClasseByTeacher }