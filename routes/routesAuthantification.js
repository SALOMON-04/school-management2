import express from "express";
import { error, log } from "console";
import {connexion} from "../controleur/controleAuthan.js"



const router = express.Router();



// CONNEXION DU PROF ET L'ADMIN

router.post("/login" , connexion);








export default router ;

