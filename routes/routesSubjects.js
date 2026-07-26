import express from "express";;
import {creationSubject, seachSubject, seachSubjectId, affectSubject, modifSubject, supprimeSubject} from "../controleur/controleSujects.js";




const router = express.Router();



router.post("/", creationSubject);


router.get("/", seachSubject);


router.get("/:id", seachSubjectId);


router.put("/:id", modifSubject);


router.put("/subject_id/:subject_id/teacher_id/:teacher_id", affectSubject);


router.delete("/:id", supprimeSubject);


export default router;

