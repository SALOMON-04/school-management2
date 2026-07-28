import { afficherUtilisateur, affUsersById, creationUsers, modiffierusers, suprimerUsers } from "../controleur/controleUser.js";
import express from "express"

import { verifierToken } from "../middleweaes/middleAuth.js";
import { autoriserRoles } from "../middleweaes/middleRoles.js"; 






const router = express.Router();



router.get("/", verifierToken, autoriserRoles("admin"), afficherUtilisateur);


router.get("/:id",  verifierToken, autoriserRoles("admin"), affUsersById);


router.post("/",  verifierToken, autoriserRoles("admin"), creationUsers);


router.put("/:id",  verifierToken, autoriserRoles("admin"), modiffierusers);


router.delete("/:id",  verifierToken, autoriserRoles("admin"), suprimerUsers);


export default router;