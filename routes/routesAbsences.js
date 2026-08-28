import express from "express";
import {creationAbsence, seachAbsence, seachAbsenceId, absencesParProf, modifAbsence, supprimeAbsence, compteAbsences, afficherAbsencesByStudent} from "../controleur/controleAbsences.js";


import { verifierToken } from "../middleweaes/middleAuth.js";
import { autoriserRoles } from "../middleweaes/middleRoles.js";



const router = express.Router();


router.post("/",  verifierToken, autoriserRoles("admin", "professeur"), creationAbsence);


router.get("/",  verifierToken, autoriserRoles("admin"), seachAbsence);


router.get("/student/:student_id/total",  verifierToken, autoriserRoles("admin", "professeur", "etudiant"), compteAbsences);


router.get("/student/:student_id",  verifierToken, autoriserRoles("admin", "professeur", "etudiant"), afficherAbsencesByStudent);


router.get("/teacher/:teacher_id", verifierToken, autoriserRoles("admin", "professeur"), absencesParProf);


router.put("/:id",  verifierToken, autoriserRoles("admin", "professeur"), modifAbsence);


router.get("/:id",  verifierToken, autoriserRoles("admin"), seachAbsenceId);


router.delete("/:id",  verifierToken, autoriserRoles("admin"), supprimeAbsence);


export default router;