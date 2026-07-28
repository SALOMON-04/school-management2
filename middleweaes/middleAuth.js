import jwt from "jsonwebtoken";

const verifierToken = (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Accès refusé, token manquant." });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Token mal formé." });
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // contient { id, role }
        next();


    } catch (error) {


        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Token invalide ou expiré." });
        }
        // erreur inattendue, vraiment côté serveur
        console.error(error);
        return res.status(500).json({ error: "Erreur interne du serveur." });

        
    }
};

export { verifierToken };