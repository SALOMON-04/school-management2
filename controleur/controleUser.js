import { createUser, getAllUsers, getUserByUsername, updateUsers, getUserById, deleteUser } from "../services/servicesUsers.js";



const afficherUtilisateur = (req, res) => {

    const afficher = getAllUsers();

    return res.status(200).json(afficher);
};


const affUsersById = (req, res) => {

    const id = Number(req.params.id);
    const user = getUserById(id);

    if (!user) {
        return res.status(404).json({ error: "Utilisateur introuvable" });
    };

    return res.json(user);
};


const creationUsers = (req, res) => {

    const { nom, role, username } = req.body;

    const user = createUser(nom, role, username);


    if (user) {
        return res.status(201).json({id: user, nom, role, username});
    };

    return res.json(user);

};


const modiffierusers = (req, res) => {

    const id = Number(req.params.id);
    const data = req.body;

    const modiffier = updateUsers(id, data);

    if (modiffier.changes === 0) {
        return res.status(404).json({ error: "Utilisateur introuvable." });
    };

    return res.status(200).json({
        id: id, 
        nom: data.nom, 
        role: data.role, 
        username: data.username
    });
};


const suprimerUsers = (req, res) => {

    const id = Number(req.params.id);
    const user = deleteUser(id);

    if (user.changes === 0) {
        return res.status(404).json({ error: "Utilisateur introuvable." });
    };

    return res.status(200).json(`l'utilisateur a l'${id} a bien été suprimé`)
};


export {afficherUtilisateur, affUsersById, creationUsers, modiffierusers, suprimerUsers }