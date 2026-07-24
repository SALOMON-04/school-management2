import express from "express";
import { creationStudent, seachStudent, seachStudentsId, seachStudentsMatricule, modifStudent, supprimeStudent } from "../controleur/controleStudents.js";


const router = express.Router();




router.post("/", creationStudent);



router.get("/", seachStudent);


router.get("/matricule/:matricule", seachStudentsMatricule);


router.get("/:id", seachStudentsId);


router.put("/:id", modifStudent);


router.delete("/:id", supprimeStudent);


export default router;

