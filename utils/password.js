import {randomUUID} from "crypto";
import db from "../db/database.js"


const lettres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const  carctere = ["@", "#", "!", "$", "%", "&", "*", "?", "_", "/"];

const symboles = () => carctere[Math.floor(Math.random() * carctere.length)] ;
const lettreAleatoire = () => lettres[Math.floor(Math.random() * lettres.length)]

const generPassword = (nom = "") => {

    let password ;

    do {


        let aleatoire = "" ;
        for(let i = 0; i < 3; i++){
            aleatoire += lettreAleatoire() ;
        } ;

        const chiffre = Math.floor(Math.random() * 90) + 10 ;

        password = `${aleatoire}${symboles()}${chiffre}${aleatoire}${symboles()}` ;

    }while (db.prepare("SELECT 1 FROM users WHERE password = ?").get(password) ) ;
    
    return password ;
}


// console.log(generPassword());

export default generPassword ;