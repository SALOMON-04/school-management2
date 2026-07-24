import express from "express";
import path from "path";

import { fileURLToPath } from "url";



//Mes routes
import routesAuth from "./routes/routesAuthantification.js";
import routesUsers from "./routes/routesUsers.js";
import routeStudents from "./routes/routesStudents.js"
import routeTeachers from "./routes/routesTeachers.js"
import routeSubject from "./routes/routesSubjects.js"






const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





const app = express() ;  // creaation du server



// Recherche des requetes
app.use(express.json());  //convertion des information fichier json
app.use("/api/auth", routesAuth); // recherche de  de tout ce qui est liée a l'authantification
app.use("/api/users", routesUsers);
app.use("/api/students",routeStudents);
app.use("/api/teachers", routeTeachers);
app.use("/api/subjects", routeSubject);






// donnné accès aux dossiers public de manière automatiques en utilisant la conversion des chemins

app.use(express.static(path.join(__dirname, "public"))); 



// Redirectipon de la route vers la page de connexion;
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dossierhtml", "index.html"));
});


//demarage du server

const PORT = 3000 ;
app.listen(PORT, () => {console.log(`server demarré sur le port ${PORT}`);
})