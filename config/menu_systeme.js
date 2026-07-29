import { menuPrincipal, menuRole, menuAdmin, menuProfesseur, menuEtudiant } from "./menu.js";

import { question, fermer, connexionUser, connexionEtudiant } from "./authantification.js";

import { createUser, getAllUsers, updateUsers, getUserById, deleteUser } from "../services/servicesUsers.js";
import { createTeacher, getAllTeacher, getAllTeacherAvecMatiere, getTeacherByUser_id, getTeacherById, updateTeacher, deleteTeacher } from "../services/servicesTeachers.js";
import { createSubject, getAllSubjects, getSubjectById, updateASubject, choixMatiere, affectTeacherSubject, deleteSubject } from "../services/servicesSubjects.js";
import { createStudent, getAllStudents, getStudentById, updateStudent, choixEtudiant, deleteStudent } from "../services/servicesStudents.js";
import { addNoteGrade, updateGrades, deleteGrades, affGrades, getStudentGrades, calculMoyenne, meilleurEtudiant } from "../services/servicesGrades.js";
import { createAbsence, getAllAbscence, getAbsenceById, updateAbsence, deleteAbsence, nombreAbsences, getStudentAbsences } from "../services/servicesAbsences.js";
import { moyenneGeneraleByStudent, moyenneGeneraleEcole, moyenneGeneralEtuddiant, totalUsers, totalStudent, totalProfesseur } from "../services/servicesStatistiques.js";
import { logger } from "../utils/logger.js"; 





const sommaireAdmin = async (user) => {

    let continuer = true;

    // cette boucle permet de resté dans le menu principale de l'administrateur

    while (continuer) {

        // "choix" permet de recupérer le menuAmin dans notre fichier menu
        const choix = await question(menuAdmin);


        switch (choix.trim()) {


            // GESTION DES UTILISATEURS : le sous menu qui permet 
            // d'avoir accès sur ce qui concerne tout type d'utilisateur

            case "1": {
                let sousMenu = true;
                while (sousMenu) {

                    const sousChoix = await question(`
                        
==========================
  GÉRER LES UTILISATEURS 
==========================

1. Ajouter un utilisateur
2. Modifier un utilisateur
3. Supprimer un utilisateur
4. Lister tous les utilisateurs
5. Rechercher un utilisateur
0. Retour

===========================

Votre choix : `);

                    switch (sousChoix.trim()) {


                        // Enregistrement d'un nouvel utilisateur

                        case "1": {

                            console.table(getAllUsers()); // Afficher tous les utilisateur existant dans la base de données

                            const nom = await question("Nom : ");
                            const role = await question("Rôle (Admin / Profésseur / Etudiant) : ");
                            const username = await question("Username : ");
                            const password = await question("Mot de passe : ");


                            if (!nom.trim() || !role.trim() || !username.trim() || !password.trim()) {
                                console.log("Tous les champ sont obligatoires");
                                logger.warning(`${user.nom} a tenté de modifier l'utilisateur ID ${id} avec des champs vides`);
                                break;
                            };

                            const result = await createUser(nom, role, username, password);


                            // Veriffication de l'username existant et affichage de l'erreur sans que le programme s'arrete
                            if(result?.erreur){
                                console.log(`${result.erreur}`);
                                break
                            };


                            console.log("Utilisateur ajouté.");
                            logger.info(`${user.nom} a ajouté l'utilisateur ${nom} (${role})`);
                            break;

                        }


                        // Modification des infos d'un utilisateur 

                        case "2": {


                            console.table(getAllUsers()); // Afficher tous les utilisateur existant dans la base de données

                            const id = await question("ID de l'utilisateur à modifier : ");
                            const nom = await question("Nouveau nom : ");
                            const role = await question("Nouveau rôle : ");
                            const username = await question ("Nouveau username : ")


                            // cette condition verifi si les champs de modif ne son pas vide si oui, on la modif n'est pas enregistré

                            if (!nom.trim() || !role.trim()|| !username.trime()) {
                                console.log("Tous les champ sont obligatoires");
                                logger.warning(`${user.nom} a tenté de modifier l'utilisateur ID ${id} avec des champs vides`);
                                break;
                            };

                            updateUsers(Number(id), { nom, role });
                            console.log("Utilisateur modifié.");
                            logger.info(`${user.nom} a modifié l'utilisateur ID ${id}`);
                            break;
                        }


                        // Suppression d'un utilisateur par son ID

                        case "3": {

                            console.table(getAllUsers()); // Afficher tous les utilisateur existant dans la base de données

                            const id = await question("ID de l'utilisateur à supprimer : ");
                            deleteUser(Number(id));

                            console.log("Utilisateur supprimé.");
                             logger.info(`${user.nom} a supprimé l'utilisateur ID ${id}`);
                            break;

                        }


                        // Affichage de tous les utilisateurs

                        case "4": {
                            console.table(getAllUsers());
                            break;
                        }


                        // Recherche d'un seul utilisateur par son ID

                        case "5": {
                            
                            console.table(getAllUsers()); // Afficher tous les utilisateur existant dans la base de données

                            const id = await question("ID de l'utilisateur : ");
                            console.log(getUserById(Number(id)));
                            break;
                        }

                        case "0": sousMenu = false; break;
                        default: console.log("Choix invalide.");
                    }
                }

            } break;



            // MENU DE GESTION DE L'ETUDIANT : le sous menu qui permet 
            // d'avoir accès sur ce qui concerne tous étudiants

            case "2": {


                //  cette boucle nous permet de ne pas sortir du menu des utilisateur après une action
                let sousMenu = true;
                while (sousMenu) {


                    const sousChoix = await question(`
===========================
    GÉRER LES ÉTUDIANTS
===========================

1. Ajouter un étudiant
2. Modifier un étudiant
3. Supprimer un étudiant
4. Lister tous les étudiants
5. Rechercher un étudiant
0. Retour

===========================

Votre choix : `);

                    switch (sousChoix.trim()) {

                        // Enregistremant d'un étudiant

                        case "1": {

                            const matricule = await question("Matricule : ");
                            const nom = await question("Nom : ");
                            const prenom = await question("Prénom : ");
                            const age = await question("Âge : ");
                            const classe = await question("Classe : ");
                            const username = await question("Username : ");
                            const password = await question("Mot de passe : ");


                            // Cette condition permet de vérifier si un champs est vide si oui, l'enregistrement est annulé

                            if (!matricule.trim() || !nom.trim() || !prenom.trim() || !age.trim() || !classe.trim() || !username.trim() || !password.trim()) {
                                console.log("Tous les champs sont obligatoires.");
                                logger.warning(`${user.nom} a tenté de modifier l'étudiant ID ${id} avec des champs vides`);
                                break;
                            };


                            const result = await createStudent(matricule, nom, prenom, Number(age), classe, username, password);

                            // Veriffication de l'username existant et affichage de l'erreur sans que le programme s'arrete
                            if(result?.erreur){
                                console.log(`${result.erreur}`);
                                break
                            };


                            
                            console.log("Étudiant ajouté.");
                            logger.info(`${user.nom} a ajouté l'étudiant  (matricule: ${matricule}) ${prenom} ${nom} `);
                            
                            break;
                        }


                        // Modiffication d'es information d'un étudiant

                        case "2": {

                            const id = await question("ID de l'étudiant à modifier : ");
                            const matricule = await question("Nouveau matricule : ");
                            const nom = await question("Nouveau nom : ");
                            const prenom = await question("Nouveau prénom : ");
                            const age = await question("Nouvel âge : ");
                            const classe = await question("Nouvelle classe : ");


                            // Cette condition permet de vérifier si un champs est vide si oui, l'enregistrement est annulé

                            if (!matricule.trim() || !nom.trim() || !prenom.trim() || !age.trim() || !classe.trim()) {
                                console.log("Tous les champs sont obligatoires.");
                                logger.warning(`${user.nom} a tenté d'enregistrer un étudiantavec des champs vides`);
                                break;
                            }

                            updateStudent(Number(id), { matricule, nom, prenom, age: Number(age), classe });
                            console.log("Étudiant modifié.");
                            logger.info(`${user.nom} a modifié l'étudiant ID ${id}`);
                            break;
                        }


                        // Supression d'un étudiant

                        case "3": {

                            console.table(getAllStudents()); // Afficher tout les étudiant dans la base de donnée

                            const id = await question("ID de l'étudiant à supprimer : ");

                            deleteStudent(Number(id));
                            console.log("Étudiant supprimé.");
                             logger.info(`${user.nom} a supprimé l'étudiant ID ${id}`);
                            break;
                        }

                        // Liste de tous les étudiants

                        case "4": {
                            const etudiants = getAllStudents();
                            console.table(etudiants);
                            break;
                        }


                        // rechercher un etudiant

                        case "5": {

                            console.table(getAllStudents()); // Afficher tout les étudiant dans la base de donnée
                            
                            const id = await question("ID de l'étudiant : ");
                            const etudiant = getStudentById(Number(id));
                            console.log(etudiant ?? "Étudiant introuvable.");
                            break;
                        }

                        case "0": sousMenu = false; break;
                        default: console.log("Choix invalide.");
                    }
                }

            } break;





            // MENU GESTION DU PROFFESSEUR : le sous menu qui permet 
            // d'avoir accès sur ce qui concerne tous les profésseurs

            case "3": {


                //  cette boucle nous permet de ne pas sortir du menu des proffesseur après une action
                let sousMenu = true;
                while (sousMenu) {

                    const sousChoix = await question(`

=============================
    GÉRER LES PROFESSEURS 
=============================

1. Ajouter un professeur
2. Modifier un professeur
3. Supprimer un professeur
4. Lister tous les professeurs
5. Rechercher un professeur
0. Retour

=============================
Votre choix : `);

                    switch (sousChoix.trim()) {

                        // Enregistrement d'un profésseur

                        case "1": {

                            //afficher tous les profs 
                            console.table(getAllTeacher());

                            // Affiche toutes les matières pour le choix des id
                            console.table(getAllSubjects());

                            const nom = await question("Nom : ");
                            const matiere = await question("ID de la matière : ");
                            const username = await question("Username : ")
                            const password = await question("Mot de passe : ");

                            // Cette condition permet de vérifier si un champs est vide si oui, l'enregistrement est annulé

                            if (!nom.trim() || !matiere.trim() || !username.trim() || !password.trim()) {
                                console.log("Tous les champs sont obligatoires.");
                                logger.warning(`${user.nom} a tenté d'enregistré un professeur avec des champs vides`);
                                break;
                            }


                            const result = await createTeacher(nom, matiere, username, password);

                           
                            // Veriffication de l'username existant et affichage de l'erreur sans que le programme s'arrete
                            if(result?.erreur){
                                console.log(`${result.erreur}`);
                                break
                            };

                            console.log("Professeur ajouté.");
                            logger.info(`${user.nom} a ajouté le professeur ${nom}`);
                            break;
                        }


                        // Modiffcation des infos d'un profésseur

                        case "2": {


                            console.table(getAllTeacher()); // afficher tous les profs
                            console.table(getAllSubjects()); // afficher toutes les matières

                            const id = await question("ID du professeur à modifier : ");
                            const nom = await question("Nouveau nom : ");
                            const matiere = await question("Nouvelle ID de la matière : ");
                            const username = await question("Nouveau username : ")

                            // Cette condition permet de vérifier si un champs est vide si oui, l'enregistrement est annulé

                            if (!nom.trim() || !matiere.trim() || !username.trim()) {
                                console.log("Tous les champs sont obligatoires.");
                                logger.warning(`${user.nom} a tenté de modifier le professeur ID ${id} avec des champs vides`);
                                break;
                            }

                            updateTeacher(Number(id), { nom, matiere });
                            console.log("Professeur modifié.");
                            logger.info(`${user.nom} a modifié le professeur ID ${id}`);
                            break;
                        }


                        // Supression d'un  prof

                        case "3": {


                            console.table(getAllTeacher()); // afficher tous les profs

                            const id = await question("ID du professeur à supprimer : ");
                            deleteTeacher(Number(id));

                            console.log("Professeur supprimé.");
                             logger.info(`${user.nom} a supprimé le professeur ID ${id}`);
                            break;
                        }



                        // Affichage de tous les professeurs avec le nom de leur matière

                        case "4": {

                            console.table(getAllTeacherAvecMatiere());
                            break;

                        }


                        // affichage d'un profésseur

                        case "5": {

                            console.table(getAllTeacher()); // afficher tous les profs
                            
                            const id = await question("ID du professeur : ");
                            console.log(getTeacherById(Number(id)));
                            break;

                        }

                        case "0": sousMenu = false; break;
                        default: console.log("Choix invalide.");
                    }
                }

            } break;



            // GESTION  DES MATIERE : le sous menu qui permet 
            // d'avoir accès sur ce qui concerne tous les matières au programme

            case "4": {


                //  cette boucle nous permet de ne pas sortir du menu des matières après une action

                let sousMenu = true;
                while (sousMenu) {

                    const sousChoix = await question(`

==========================
    GÉRER LES MATIÈRES 
==========================

1. Ajouter une matière
2. Affecter un professeur à une matière
3. Lister toutes les matières
4. modifier une matière
5. Rechercher une matière
6. Supprimer une matière
0. Retour

==========================

Votre choix : `);

                    switch (sousChoix.trim()) {


                        // Enregistrement d'une  nouvelle matière

                        case "1": {

                            console.table(getAllSubjects()); //afficher toute les matière affin de voir celle qui existe déja
                            
                            const nom = await question("Nom de la matière : ");
                            createSubject(nom);

                            console.log("Matière ajoutée.");
                            logger.info(`${user.nom} a ajouté la matière ${nom}`);
                            break;
                        }


                        // affectaion d'une matière a unprofésseur

                        case "2": {

                            
                            console.table(getAllSubjects()) // Lister tous les matières
                            console.table(getAllTeacher());  // Lister tous les profs

                            const subjectId = await question("ID de la matière : ");
                            const teacherId = await question("ID du professeur : ");

                            affectTeacherSubject(Number(subjectId), Number(teacherId));
                            console.log("Professeur affecté.");
                            logger.info(`${user.nom} a affecté le professeur ID ${teacherId} à la matière ID ${subjectId}`);
                            break;

                        }


                        // Liste de toutes les matières

                        case "3": {
                            console.table(getAllSubjects());
                            break;
                        }


                        // Modification d'une matière avec le prof concerné

                        case "4": {


                            console.table(getAllSubjects()); // Afficher toutes les matière

                            const id = await question("ID de la note à modifier : ");
                            const matiere = await question("Nouvelle matière : ");

                            if (!matiere.trim()) {
                                console.log('Le champ ma ne doit pas etre vide');
                                 logger.warning(`${user.nom} a tenté de modifier la matière ID ${id} avec un champ vide`);
                                break;

                            }

                            updateASubject(Number(id), { nom: matiere });
                            console.log("matière modifiée.");
                            logger.info(`${user.nom} a modifié la matière ID ${id}`);
                            break;

                        }


                        // Rechrche d'une seule matière par son ID

                        case "5": {

                            console.table(getAllSubjects()); // Afficher toutes les matière

                            const id = await question("ID de la matière : ");
                            console.log(getSubjectById(Number(id)));
                            break;
                        }

                        // Supression de la matière par son ID

                        case "6": {

                            console.table(getAllSubjects()); // Afficher toutes les matière

                            const id = await question("ID de la matière à supprimer : ");
                            deleteSubject(Number(id));

                            console.log("Matière supprimée.");
                            logger.info(`${user.nom} a supprimé la matière ID ${id}`);
                            break;
                        }


                        case "0": sousMenu = false; break;
                        default: console.log("Choix invalide.");
                    }

                }

            } break;





            //   GESTION DES MENU : le sous menu qui permet 
            // d'avoir accès sur ce qui concerne tous les notes

            case "5": {


                //  cette boucle nous permet de ne pas sortir du menu des nptes après une action

                let sousMenu = true;
                while (sousMenu) {

                    const sousChoix = await question(`
                        
=======================  
    GÉRER LES NOTES                      
=======================

1. Ajouter une note
2. Modifier une note
3. Supprimer une note
4. Voir les notes d'un étudiant
5. Calculer la moyenne d'un étudiant
0. Retour

=======================

Votre choix : `);

                    switch (sousChoix.trim()) {


                        // Ajout d'une note pour un étudiant dans une matière

                        case "1": {

                            console.table(getAllStudents()); // Afficher tous les etudiants
                            console.table(getAllSubjects()); // Afficher toutes les matières

                            const student_id = await question("ID de l'étudiant : ");
                            const subject_id = await question("ID de la matière : ");
                            const note = await question("Note : ");

                            addNoteGrade(Number(student_id), Number(subject_id), Number(note));
                            console.log("Note ajoutée.");
                            logger.info(`${user.nom} a ajouté la note ${note} pour l'étudiant ID ${student_id} en matière ID ${subject_id}`);
                            break;

                        }


                        // Modification d'une note existante

                        case "2": {

                            console.table(affGrades()) // afficher la table grades et les information quelle contient

                            const id = await question("ID de la note à modifier : ");
                            const note = await question("Nouvelle note : ");

                            if (!note.trim()) {
                                console.log('Le champ note ne doit pas etre vide');
                                logger.warning(`${user.nom} a tenté de modifier la note ID ${id} avec un champ vide`);
                                break;

                            }

                            updateGrades(Number(id), { note: Number(note) });
                            console.log("Note modifiée.");
                            logger.info(`${user.nom} a modifié la note ID ${id}`);
                            break;

                        }


                        // Suppression d'une note par son ID

                        case "3": {

                            const id = await question("ID de la note à supprimer : ");
                            deleteGrades(Number(id));

                            console.log("Note supprimée.");
                            logger.info(`${user.nom} a supprimé la note ID ${id}`);
                            break;
                        }



                        // Affichage des notes d'un étudiant dans une matière

                        case "4": {

                            console.table(getAllStudents()); // Afficher tous les étudiants existant
                            console.table(getAllSubjects()); // Afficher toutes les matière existantes


                            const student_id = await question("ID de l'étudiant : ");
                            const subject_id = await question("ID de la matière : ");

                            console.log(getStudentGrades(Number(student_id), Number(subject_id)));
                            break;
                        }


                        // Calcul de la moyenne d'un étudiant dans une matière

                        case "5": {


                            console.table(getAllStudents()); // Afficher tous les étudiants existant
                            console.table(getAllSubjects()); // Afficher toutes les matière existantes


                            const student_id = await question("ID de l'étudiant : ");
                            const subject_id = await question("ID de la matière : ");

                            console.log(calculMoyenne(Number(student_id), Number(subject_id)));
                            break;
                        }

                        case "0": sousMenu = false; break;
                        default: console.log("Choix invalide.");

                    }

                }

            } break;



            // MENU DE GESTION DES ABSCENCES : le sous menu qui permet 
            // d'avoir accès sur ce qui concerne tous les absences

            case "6": {


                //  cette boucle nous permet de ne pas sortir du menu des absences après une action
                let sousMenu = true;
                while (sousMenu) {

                    const sousChoix = await question(`

==========================
    GÉRER LES ABSENCES
==========================

1. Enregistrer une absence
2. Modifier une absence
3. Supprimer une absence
4. Voir les absences d'un étudiant
5. Compter les absences non justifiées
0. Retour

==========================

Votre choix : `);

                    switch (sousChoix.trim()) {


                        // Enregistrement d'une absence pour un étudiant

                        case "1": {

                            console.table(getAllStudents()); // Afficher tous les étudiants existant

                            const student_id = await question("ID de l'étudiant : ");
                            const status = await question("Statut (Justifié / Non justifié) : ");

                            createAbsence(Number(student_id), status);
                            console.log("Absence enregistrée.");
                             logger.info(`${user.nom} a enregistré une absence (${status}) pour l'étudiant ID ${student_id}`);
                            break;
                        }


                        // Modification d'une absence existante

                        case "2": {


                            console.table(getAllStudents()); // Afficher tous les étudiants existant
                            console.table(getAllAbscence()); // Afficher la base de donner des absences

                            const id = await question("ID de l'absence à modifier : ");
                            const student_id = await question("Nouvel ID étudiant : ");
                            const status = await question("Nouveau statut (Justifié / Non justifié) : ");


                            // cette condition permet de verifier si les champ son vide lor de la modification, si oui on enregistre pas

                            if (!student_id.trim() || !status.trim()) {
                                console.log("Tous les champs sont obligatoires.");
                                logger.warning(`${user.nom} a tenté de modifier l'absence ID ${id} avec des champs vides`);
                                break;
                            }

                            const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                            updateAbsence(Number(id), { student_id: Number(student_id), date, status });
                            console.log("Absence modifiée.");
                             logger.info(`${user.nom} a modifié l'absence ID ${id}`);
                            break;
                        }


                        // Suppression d'une absence par son ID

                        case "3": {

                            console.table(getAllAbscence()); // Afficher la base de donner des absences

                            const id = await question("ID de l'absence à supprimer : ");
                            deleteAbsence(Number(id));

                            console.log("Absence supprimée.");
                             logger.info(`${user.nom} a supprimé l'absence ID ${id}`);
                            break;

                        }


                        // Affichage de toutes les absences d'un étudiant

                        case "4": {

                            console.table(getAllStudents()); // Afficher tous les étudiants existant

                            const student_id = await question("ID de l'étudiant : ");
                            console.log(getStudentAbsences(Number(student_id)));
                            break;
                        }


                        // Comptage des absences non justifiées d'un étudiant

                        case "5": {

                            console.table(getAllStudents()); // Afficher tous les étudiants existant

                            const student_id = await question("ID de l'étudiant : ");
                            console.log(nombreAbsences(Number(student_id)));
                            break;
                        }

                        case "0": sousMenu = false; break;
                        default: console.log("Choix invalide.");
                    }

                }

            } break;




            // MENU DES STATISTIQUES : le sous menu qui permet 
            // d'avoir accès sur ce qui concerne tous les absences

            case "7": {


                // Cette boucle nous permet de ne pas sortir du menu des statistiques après une action

                let sousMenu = true;
                while (sousMenu) {

                    const sousChoix = await question(`

===========================
       STATISTIQUES 
===========================

1. Moyenne d'un étudiant par matière
2. Moyenne générale d'un étudiant
3. Moyenne générale de l'école
4. Compter les absences d'un étudiant
5. Nombre total d'utilisateurs
6. Nombre total d'étudiants
7. Nombre total de professeurs
0. Retour

===========================

Votre choix : `);

                    switch (sousChoix.trim()) {


                        // Moyenne d'un étudiant dans une matière précise

                        case "1": {

                            console.table(getAllStudents()); // Afficher tous les étudiants existant
                            console.table(getAllSubjects()); // Afficher toutes les matière existantes

                            const student_id = await question("ID de l'étudiant : ");
                            const subject_id = await question("ID de la matière : ");

                            console.log(calculMoyenne(Number(student_id), Number(subject_id)));
                            break;

                        }


                        // Moyenne générale d'un étudiant toutes matières confondues

                        case "2": {

                            console.table(getAllStudents()); // Afficher tous les étudiants existant

                            const student_id = await question("ID de l'étudiant : ");

                            console.log(moyenneGeneraleByStudent(Number(student_id)));
                            break;

                        }



                        // Moyenne générale de toute l'école

                        case "3": {
                            console.log(moyenneGeneraleEcole());
                            break;
                        }


                    


                        // Comptage des absences non justifiées d'un étudiant

                        case "4": {

                            console.table(getAllStudents()); // Afficher tous les étudiants existant

                            const student_id = await question("ID de l'étudiant : ");

                            console.log(nombreAbsences(Number(student_id)));
                            break;

                        }


                        // Nombre total d'utilisateurs enregistrés

                        case "5": {
                            console.log(totalUsers());
                            break;
                        }


                        // Nombre total d'utilisateurs étudiants

                        case "6": {
                            console.log(totalStudent());
                            break;
                        }


                        // Nombre total d'utilisateurs profésseur

                        case "7": {
                            console.log(totalProfesseur());
                            break;
                        }

                        case "0": sousMenu = false; break;
                        default: console.log("Choix invalide.");
                    }

                }

            } break;


            case "0": continuer = false; break;
            default: console.log("Choix invalide.");
        }

    }

};


// MENU PROFFESSEUR


const sommaireProfesseur = async (user) => {
    let continuer = true;

    const teacher = getTeacherByUser_id(user.id) ; // récupération de la fiche du teacher

    //  cette boucle nous permet de ne pas sortir du sommaire profésseur après une action

    while (continuer) {
        const choix = await question(menuProfesseur);

        switch (choix.trim()) {

            // Ajout d'une note pour un étudiant 

            case "1": {

                const student_id = await choixEtudiant(question);
                const subject_id = await choixMatiere(question, teacher.id);  // filtre par l'id du prof
                const note = await question("Note : ");

                addNoteGrade(Number(student_id), Number(subject_id), Number(note));
                console.log("Note ajoutée.");
                logger.info(`${user.nom} a ajouté la note ${note} pour l'étudiant ${student_id}`);
                break;

            }


            // Modification d'une note existante

            case "2": {

                const student_id = await choixEtudiant(question);
                const subject_id = await choixMatiere(question, teacher.id);

                const notes = getStudentGrades(student_id, subject_id); // Affichages des note de l'etudiant uniquement

                if (notes.length === 0) {
                    console.log("Aucune note trouvée pour cet étudiant dans cette matière.");
                    break;
                }

                console.table(notes);

                const id = await question("Choisir l'ID dans le tableau : ");
                const note = await question("Nouvelle note : ");

                updateGrades(Number(id), { note: Number(note) });
                console.log("Note modifiée.");
                 logger.info(`${user.nom} a modifié une note de l'étudiant ID ${student_id}`);
                break;

            }



            // Enregistrement d'une absence pour un étudiant

            case "3": {

                console.table(getAllStudents()); // Afficher tous les étudiants existant

                const student_id = await question("ID de l'étudiant : ");
                const status = await question("Statut (Justifié / Non justifié) : ");

                createAbsence(Number(student_id), status);
                console.log("Absence enregistrée.");
                 logger.info(`${user.nom} a enregistré une absence (${status}) pour l'étudiant ID ${student_id}`);
                break;

            }


            // Affichage de tous les étudiants

            case "4": {
                console.table(getAllStudents()); break;
            }


            case "0": continuer = false; break;
            default: console.log("Choix invalide.");
        }
    }
};



// MENU ETUDIANT  : ce menu donne accès uniquement à la consultation —
// l'étudiant ne peut que voir ses propres notes, moyenne, matières et absences


const sommaireEtudiant = async (etudiant) => {

    let continuer = true;

    
    //  cette boucle nous permet de ne pas sortir du sommaire étudiant après une action

    while (continuer) {

        const choix = await question(menuEtudiant);

        switch (choix.trim()) {


            // Affichage les notes de l'étudiant dans une matière

            case "1": {

                const subject_id = await choixMatiere (question)

                console.table(getStudentGrades(etudiant.id, subject_id));
                break;

            }


            // Calcul de la moyenne de l'étudiant dans une matière

            case "2": {

                const subject_id = await choixMatiere (question)

                console.log(calculMoyenne(etudiant.id, subject_id));
                break;

            }


            // Affichage de toutes les matières disponibles

            case "3": {
                console.table(getAllSubjects());
                break;
            }


            // Affichage de toutes les absences de l'étudiant

            case "4": {
                console.table(getStudentAbsences(etudiant.id));
                break;
            }

            case "0": continuer = false; break;
            default: console.log("Choix invalide.");
        }

    }

};





// GESTION DES ROLE ET VERIFICATION DE CONEXION

const choisirRole = async () => {

    const choix = await question(menuRole);

    switch (choix.trim()) {

        case "1": {
            const user = await connexionUser("admin");
            if (user) await sommaireAdmin(user);
            break;
        }

        case "2": {
            const user = await connexionUser("professeur");
            if (user) await sommaireProfesseur(user);
            break;
        }

        case "3": {
            const etudiant = await connexionEtudiant();
            if (etudiant) await sommaireEtudiant(etudiant);
            break;
        }

        case "0": return;
        default: console.log("Choix invalide.");
    }

};



// FONCTION DE DEMARAGE DU PROGRAME


export const demarrer = async () => {

    console.log(`
╔════════════════════════════════════════╗
║ BIENVENU DANS NOTRE SYTEME DE GESTION  ║
║              SCOLAIRE                  ║
╚════════════════════════════════════════╝
`);

    let continuer = true;

    while (continuer) {
        const choix = await question(menuPrincipal);

        switch (choix.trim()) {
            case "1":
                await choisirRole();
                break;

            case "0":
                continuer = false;
                break;

            default:
                console.log(" Choix invalide.");
        }
    }

    fermer();
};
