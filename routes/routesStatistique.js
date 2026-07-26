import express from "express";
import { studentMoyenne, moyenneEcole, meilleurStudentParClasse, nombreUsers, nombreStudents, nombreTeacher } from "../controleur/controleStatistique.js"; 

const router = express.Router();


router.get("/student/:student_id/moyenne", studentMoyenne);


router.get("/ecole/moyenne", moyenneEcole);


router.get("/classes/meilleurs", meilleurStudentParClasse);


router.get("/users/total", nombreUsers);


router.get("/students/total", nombreStudents);


router.get("/professeurs/total", nombreTeacher);


export default router;