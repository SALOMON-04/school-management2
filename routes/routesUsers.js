import { afficherUtilisateur, affUsersById, creationUsers, modiffierusers, suprimerUsers } from "../controleur/controleUser.js";
import express from "express"

const router = express.Router();



router.get("/", afficherUtilisateur);


router.get("/:id", affUsersById);


router.post("/", creationUsers);


router.put("/:id", modiffierusers);


router.delete("/:id", suprimerUsers);


export default router;