import { createUser, getAllUsers, getUserByUsername, updateUsers, getUserById, deleteUser } from "../services/servicesUsers.js";



const afficherUtilisateur = async (req, res) => {

    const afficher = await getAllUsers();

    return res.status(200).json(afficher);
};


const affUsersById = async (req, res) => {

    const id = Number(req.params.id);
    const user = await getUserById(id);

    if (!user) {
        return res.status(404).json({ error: "Utilisateur introuvable" });
    };

    return res.json(user);
};


const creationUsers = async (req, res) => {

    const { nom, role, username, password} = req.body;

    const user =  await createUser(nom, role, username, password);


    if (user?.erreur) {
        return res.status(400).json({error: user.erreur});
    };

    return res.json({id: user, nom, role, username});

};


const modiffierusers = async (req, res) => {

    const id = Number(req.params.id);
    const data = req.body;

    const modiffier = await updateUsers(id, data);

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


const suprimerUsers = async (req, res) => {

    const id = Number(req.params.id);
    const user = await deleteUser(id);

    if (user.changes === 0) {
        return res.status(404).json({ error: "Utilisateur introuvable." });
    };

    return res.status(200).json(`l'utilisateur a l'${id} a bien été suprimé`)
};


export {afficherUtilisateur, affUsersById, creationUsers, modiffierusers, suprimerUsers }