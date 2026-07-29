
import "./db/tables.js";

import { getGradesByTeacher } from "./services/servicesGrades.js";
import { assignClasse } from "./services/serviceTeachers_classes.js";
import { getAllTeacher } from "./services/servicesTeachers.js";
import { getAbsencesByTeacher






 } from "./services/servicesAbsences.js";
// D'abord, il faut assigner une classe à un prof pour que le test ait du sens
const teachers = getAllTeacher();
console.log("Profs disponibles :", teachers);

// Remplace "1" par un vrai id de prof existant chez toi
const teacherId = 1;

// On assigne ce prof à la classe "3eme A" (adapte selon tes vraies classes en base)
assignClasse(teacherId, "3eme A");
console.log(`Classe assignée au prof ${teacherId}`);

// Maintenant on teste la fonction
const resultat = getGradesByTeacher(teacherId);
console.log("Notes visibles par ce prof :", resultat);




const absencesProf = getAbsencesByTeacher(teacherId);
console.log("Absences visibles par ce prof :", absencesProf);