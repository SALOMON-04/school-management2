import express from "express";
import { ajoutGrades, modifGrades, seachGrades, seachGradesStudent, moyenneStudent, supprimeGrades } from "../controleur/controleGrade.js";


import { verifierToken } from "../middleweaes/middleAuth.js";
import { autoriserRoles } from "../middleweaes/middleRoles.js";




const router = express.Router();


router.post("/",  verifierToken, autoriserRoles("admin", "professeur"), ajoutGrades);


router.get("/",verifierToken, autoriserRoles("admin"), seachGrades);


router.get("/studentId/:studentId/subjectId/:subjectId",  verifierToken, autoriserRoles("admin", "professeur", "etudiant"), seachGradesStudent);


router.get("/studentId/:studentId/subjectId/:subjectId/moyenne",  verifierToken, autoriserRoles("admin", "professeur", "etudiant"), moyenneStudent);


router.put("/:id",  verifierToken, autoriserRoles("admin", "professeur"), modifGrades);


router.delete("/:id",  verifierToken, autoriserRoles("admin"), supprimeGrades);


export default router;