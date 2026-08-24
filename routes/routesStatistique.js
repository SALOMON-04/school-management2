import express from "express";
import { studentMoyenne, moyenneEcole, meilleurStudentParClasse, nombreUsers, getStatsUsers, getStatsNotes, getStatsMatieres, getStatsProfesseurs, getStatsStudents, getStatsAbsences, nombreStudents, nombreTeacher } from "../controleur/controleStatistique.js"; 



import { verifierToken } from "../middleweaes/middleAuth.js";
import { autoriserRoles } from "../middleweaes/middleRoles.js";



const router = express.Router();


router.get("/student/:student_id/moyenne",  verifierToken, autoriserRoles("admin", "professeur", "etudiant"), studentMoyenne);


router.get("/ecole/moyenne",  verifierToken, autoriserRoles("admin"), moyenneEcole);


router.get("/classes/meilleurs",  verifierToken, autoriserRoles("admin", "professeur"), meilleurStudentParClasse);


router.get("/users/total",  verifierToken, autoriserRoles("admin"), nombreUsers);


router.get("/students/total",  verifierToken, autoriserRoles("admin"), nombreStudents);


router.get("/professeurs/total",  verifierToken, autoriserRoles("admin"), nombreTeacher);


router.get("/users/stats", verifierToken, getStatsUsers);

router.get("/students/stats",    verifierToken, getStatsStudents);


router.get("/professeurs/stats", verifierToken, getStatsProfesseurs);


router.get("/matieres/stats",    verifierToken, getStatsMatieres);


router.get("/notes/stats",       verifierToken, getStatsNotes);


router.get("/absences/stats",    verifierToken, getStatsAbsences);

export default router;