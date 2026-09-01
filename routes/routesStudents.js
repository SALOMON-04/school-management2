import express from "express";
import { creationStudent, seachStudent, seachStudentsId, seachStudentByUserId, seachStudentsMatricule,modifStudent, supprimeStudent } from "../controleur/controleStudents.js";

import { getStatsStudents } from "../controleur/controleStatistique.js";

import { verifierToken } from "../middleweaes/middleAuth.js";
import { autoriserRoles } from "../middleweaes/middleRoles.js";



const router = express.Router();




router.post("/",  verifierToken, autoriserRoles("admin"), creationStudent);



router.get("/",  verifierToken, autoriserRoles("admin", "professeur"), seachStudent);


router.get("/matricule/:matricule",  verifierToken, autoriserRoles("admin"), seachStudentsMatricule);


router.get("/stats",    verifierToken,  getStatsStudents);


router.get("/user/:user_id", verifierToken, seachStudentByUserId);


router.get("/:id",  verifierToken, autoriserRoles("admin", "professeur"), seachStudentsId);


router.put("/:id",  verifierToken, autoriserRoles("admin"), modifStudent);


router.delete("/:id",  verifierToken, autoriserRoles("admin"), supprimeStudent);




export default router;

