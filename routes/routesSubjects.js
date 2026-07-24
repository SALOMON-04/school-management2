import express from "express";;
import {creationSubject, seachSubject, seachSubjectId, modifSubject, affectTeacherSubject, deleteSubject, supprimeSubject} from "../controleur/controleSujects.js";




const router = express.Router();



router.post("/", creationSubject);


router.get("/", seachSubject);


router.get("/:id", seachSubjectId);


router.put("/id", modifSubject);


router.put("/subject_id/:id/teacher_id/:id", affectTeacherSubject);


router.delete("/:id", supprimeSubject);


export default router;

