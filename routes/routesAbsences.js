import express from "express";
import {creationAbsence, seachAbsence, seachAbsenceId, modifAbsence, supprimeAbsence, compteAbsences, afficherAbsencesByStudent} from "../controleur/controleAbsences.js";

const router = express.Router();


router.post("/", creationAbsence);


router.get("/", seachAbsence);


router.get("/student/:student_id/total", compteAbsences);


router.get("/student/:student_id", afficherAbsencesByStudent);


router.get("/:id", seachAbsenceId);


router.put("/:id", modifAbsence);


router.delete("/:id", supprimeAbsence);


export default router;