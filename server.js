import express from "express";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express() ;  // creaation du server


app.use(express.json());  //convertion des information fichier json



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