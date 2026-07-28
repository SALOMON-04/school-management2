import express from "express";
import { creationTeacher, seachteacher, seachteacherId, seachteacherUser_id, seachteacherMatiere, modifTeacher, supprimeTeacher} from "../controleur/controleTeachers.js";


import { verifierToken } from "../middleweaes/middleAuth.js";
import { autoriserRoles } from "../middleweaes/middleRoles.js";



const router = express.Router();


router.post("/", verifierToken, autoriserRoles("admin"), creationTeacher);


router.get("/",  verifierToken, autoriserRoles("admin"), seachteacher);


router.get("/matiere/:matiere",  verifierToken, autoriserRoles("admin"), seachteacherMatiere);


router.get("/:id",  verifierToken, autoriserRoles("admin"), seachteacherId);


router.get("/user/:user_id",  verifierToken, autoriserRoles("admin", "professeur"), seachteacherUser_id);



router.put("/:id", verifierToken, autoriserRoles("admin"), modifTeacher);


router.delete("/:id",  verifierToken, autoriserRoles("admin"), supprimeTeacher);


export default router; 