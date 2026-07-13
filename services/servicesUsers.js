import db from "../db/database.js";
import Users from "../models/modelsUser.js"
import generPassword from "../utils/password.js";


//AJOUTER UN UTILISATEUR

const createUser = (nom, role, username) => {

    // Veriffication des usernames dans la base de donnée , si elle exixte on 
    // renvoie erreur sinon on ajoute le nouveau username 
    const existant = db.prepare(`SELECT id FROM users WHERE username = ?`)

    if(existant){
        return {erreur: `${username} déja utilisé, veuiller choisir un autre username`};
    }




    const  password = generPassword(nom) ; //génération du mot de passe automatique

    // Appel du models utilisateur
    const addUsers = new Users(nom, role, username, password);


    const insertUsers = db.prepare(`
            INSERT INTO users(nom, role, username, password)
            VALUES(?, ?, ?, ?)
    `)
    
    
    const result = insertUsers.run(addUsers.nom, addUsers.role, addUsers.username, addUsers.password)

    console.log(`Mot de passe généré : ${password}`);

        console.log(result)
    // on retourne le résultat ET l'id généré, pour que createStudent/createTeacher puissent l'utiliser
    return result.lastInsertRowid ;
}



// AFFICHER LES UTILISATEUR

const getAllUsers = () => {
    return db.prepare(`
            SELECT * FROM users
    `).all();
};



// AFFICHER UN UTILISATEUR

const getUserById = (id) => {

    return db.prepare(`
            SELECT * FROM users
            WHERE id = ?
    `).get(id);

};



// RECHERCHE D'UN UTILISATUER PAR SON NOM ET MOT DE PASSE

const getUserByUsername = (username, password) => {
    return db.prepare(`
        SELECT * FROM users
        WHERE username = ? AND password = ?
    `).get(username, password);
};


// MODIFICATION D'UN UTILISATEUR

const updateUsers = (id, data) => {

    const updateUsersStmt = db.prepare(`
        UPDATE users SET  nom = ?, role = ?
        WHERE id = ?
    `);

    return updateUsersStmt.run(data.nom, data.role, id);
}



//SUPPRESION D'UN UTILISATEUR

const deleteUser = (id) => {

    // on cherche si cet utilisateur est lié à un étudiant
    const student = db.prepare(`SELECT * FROM students WHERE user_id = ?`).get(id);

    if (student) {
        db.prepare(`DELETE FROM grades WHERE student_id = ?`).run(student.id);
        db.prepare(`DELETE FROM absences WHERE student_id = ?`).run(student.id);
        db.prepare(`DELETE FROM students WHERE id = ?`).run(student.id);
    }

    // on cherche si cet utilisateur est lié à un professeur
    const teacher = db.prepare(`SELECT * FROM teachers WHERE user_id = ?`).get(id);

    if (teacher) {
        db.prepare(`UPDATE subjects SET teacher_id = NULL WHERE teacher_id = ?`).run(teacher.id);
        db.prepare(`DELETE FROM teachers WHERE id = ?`).run(teacher.id);
    }

    // enfin on supprime l'utilisateur
    return db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
};



export { createUser, getAllUsers, getUserByUsername, updateUsers, getUserById, deleteUser }