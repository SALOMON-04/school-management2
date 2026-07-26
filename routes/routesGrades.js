import express from "express";
import { ajoutGrades, modifGrades, seachGrades, seachGradesStudent, moyenneStudent, supprimeGrades } from "../controleur/controleGrade.js";

const router = express.Router();


router.post("/", ajoutGrades);


router.get("/", seachGrades);


router.get("/studentId/:studentId/subjectId/:subjectId", seachGradesStudent);


router.get("/studentId/:studentId/subjectId/:subjectId/moyenne",  moyenneStudent);


router.put("/:id", modifGrades);


router.delete("/:id", supprimeGrades);


export default router;