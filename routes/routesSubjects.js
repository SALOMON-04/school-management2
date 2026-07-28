import express from "express";;
import {creationSubject, seachSubject, seachSubjectId, affectSubject, modifSubject, supprimeSubject} from "../controleur/controleSujects.js";




import { verifierToken } from "../middleweaes/middleAuth.js";
import { autoriserRoles } from "../middleweaes/middleRoles.js";


const router = express.Router();



router.post("/",  verifierToken, autoriserRoles("admin"), creationSubject);


router.get("/",  verifierToken, autoriserRoles("admin", "professeur", "etudiant"),  seachSubject);


router.get("/:id",  verifierToken, autoriserRoles("admin", "professeur", "etudiant"), seachSubjectId);


router.put("/:id",  verifierToken, autoriserRoles("admin"), modifSubject);


router.put("/subject_id/:subject_id/teacher_id/:teacher_id",  verifierToken, autoriserRoles("admin"),  affectSubject);


router.delete("/:id",  verifierToken, autoriserRoles("admin"), supprimeSubject);


export default router;

