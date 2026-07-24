import express from "express";
import { creationTeacher, seachteacher, seachteacherId, seachteacherUser_id, seachteacherMatiere, modifTeacher, supprimeTeacher} from "../controleur/controleTeachers.js";




const router = express.Router();


router.post("/", creationTeacher);


router.get("/", seachteacher);


router.get("/matiere/:matiere", seachteacherMatiere);


router.get("/:id", seachteacherId);


router.get("/user/:user_id", seachteacherUser_id);

router.put("/:id", modifTeacher);



router.delete("/:id", supprimeTeacher);


export default router; 