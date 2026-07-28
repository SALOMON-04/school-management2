const autoriserRoles = (...rolesAutorises) => {

    return (req, res, next) => {

        let autorise = false;

        for (let i = 0; i < rolesAutorises.length; i++) {
            if (rolesAutorises[i] === req.user.role) {
                autorise = true;
            }
        }

        if (!autorise) {
            return res.status(403).json({ error: "Accès interdit, vous n'avez pas les droits nécessaires." });
        }

        next();
    };

};

export { autoriserRoles };   