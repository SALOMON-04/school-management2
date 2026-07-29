import express from "express";
import { classeAssigniger, classeRetirer, afficherClassesTeacher } from "../controleur/controleTeacher_classes.js";
import { verifierToken } from "../middleweaes/middleAuth.js";
import { autoriserRoles } from "../middleweaes/middleRoles.js";

const router = express.Router();


router.post("/", verifierToken, autoriserRoles("admin"), classeAssigniger);

router.delete("/:teacher_id/:classe", verifierToken, autoriserRoles("admin"), classeRetirer);

router.get("/:teacher_id", verifierToken, autoriserRoles("admin", "professeur"), afficherClassesTeacher);

export default router;