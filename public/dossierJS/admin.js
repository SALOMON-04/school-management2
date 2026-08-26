


protegePages('admin');




const etudiantsParClasse = {
    "L1-Info": [
        { id: "2025L1006", nom: "Bamba Mariam" },
        { id: "2025L1009", nom: "Fofana Aissata" }
    ],
    "L2-Info": [
        { id: "2025L2001", nom: "Kouassi Jean" },
        { id: "2025L2002", nom: "Traoré Fatou" },
        { id: "2025L2003", nom: "Yao Serge" }
    ],
    "L2-Res": [
        { id: "2025L2004", nom: "Koné Aminata" },
        { id: "2025L2007", nom: "Coulibaly Adama" }
    ],
    "L3-Sec": [
        { id: "2025L2005", nom: "N'Guessan Koffi" },
        { id: "2025L2008", nom: "Diabaté Moussa" }
    ]
};


function afficherSection(element) {

    const toutesLesSections = document.querySelectorAll('.page_section');
    toutesLesSections.forEach(function (section) {
        section.style.display = 'none';
    });

    const nomSection = element.getAttribute('data-section');
    document.getElementById(nomSection).style.display = 'block';

    const tousLesItems = document.querySelectorAll('.nav-item');
    tousLesItems.forEach(function (item) {
        item.classList.remove('active');
    });
    element.classList.add('active');

}


function filtrerEtudiants(idClasse, idEtudiant) {

    const classeChoisie = document.getElementById(idClasse).value;
    const listeEtudiants = document.getElementById(idEtudiant);
    listeEtudiants.innerHTML = '';

    if (!classeChoisie || !etudiantsParClasse[classeChoisie]) {
        listeEtudiants.innerHTML = '<option value="">Sélectionnez d\'abord une classe</option>';
        return;
    }

    listeEtudiants.innerHTML = '<option value="">Sélectionnez un étudiant</option>';

    etudiantsParClasse[classeChoisie].forEach(function (etudiant) {
        const option = document.createElement('option');
        option.value = etudiant.id;
        option.textContent = etudiant.id + ' - ' + etudiant.nom;
        listeEtudiants.appendChild(option);
    });

}


function changerStatut(statut) {

    const btnJustifie = document.getElementById('btn_justifie');
    const btnNonJustifie = document.getElementById('btn_non_justifie');

    btnJustifie.classList.remove('active');
    btnNonJustifie.classList.remove('active');

    if (statut === 'justifie') {
        btnJustifie.classList.add('active');
    } else {
        btnNonJustifie.classList.add('active');
    }

}




// branchement des evenements du menu (remplace les onclick dans le html)

document.querySelectorAll('.nav-item[data-section]').forEach(function (item) {
    item.addEventListener('click', function () {
        afficherSection(item);
    });
});


// branchement du select classe -> liste des etudiants (page notes)

document.getElementById('classe_note').addEventListener('change', function () {
    filtrerEtudiants('classe_note', 'etudiant_note');
});


// branchement du select classe -> liste des etudiants (page absences)

document.getElementById('classe_absence').addEventListener('change', function () {
    filtrerEtudiants('classe_absence', 'etudiant_absence');
});


// branchement des boutons justifie / non justifie (page absences)

document.getElementById('btn_justifie').addEventListener('click', function () {
    changerStatut('justifie');
});

document.getElementById('btn_non_justifie').addEventListener('click', function () {
    changerStatut('non_justifie');
});









// SECTION UTLISATEUR association du front au back a traver les routes



const statUser = document.querySelector(".statUser");
const statUserEtudiant = document.querySelector(".statUserEtudiant");
const statUserProf = document.querySelector(".statUserProf");
const statUserAdmin = document.querySelector(".statUserAdmin")


const chargerStats = async () => {
    const token = localStorage.getItem("token");

    const reponse = await fetch("http://localhost:3000/api/statis/users/stats", {
        headers: { "Authorization": "Bearer " + token }
    });

    const stats = await reponse.json();

    statUser.textContent = stats.total;
    statUserEtudiant.textContent = stats.etudiants;
    statUserProf.textContent = stats.professeurs;
    statUserAdmin.textContent = stats.admins;
};





// Chargement de la liste dans la bd user


let tousLesUser = [];



const chargerUser = async () => {

    const token = localStorage.getItem("token");

    const reponse = await fetch("http://localhost:3000/api/users", {
        headers: { "Authorization": "Bearer " + token }
    });

    const utilisateur = await reponse.json();

    tousLesUser = utilisateur;

    afficherLignesUsers(tousLesUser);
};






// fonction de recharge de la liste des utilisateur avec les bouton d'action modif et suprim


const afficherLignesUsers = (liste) => {

    const tbody = document.getElementById("listeUsers");

    tbody.innerHTML = "";

    liste.forEach(function (user) {

        const ligne = document.createElement("tr");

        ligne.innerHTML = `
                <div class="panneau_formulaire">

                    <td>${user.id}</td>
                    <td>${user.nom}</td>
                    <td>${user.username}</td>
                    <td>${user.role}</td>
                    <td>
                        <div class="actions_ligne">

                            <button class="btn_action modifier btn_modiUsers"><i class="fa-solid fa-pen"></i></button>
                            <button class="btn_action supprimer btn_supprimerUser"><i class="fa-solid fa-trash"></i></button>
                        
                        </div>
                    </td>

                </div>

        `;



        // Recuperation des bouton du formulaire cahé de modification

        const btnModif = ligne.querySelector(".btn_modiUsers");
        const btnSprim = ligne.querySelector(".btn_supprimerUser");



        // Supprimer un utilisateur
        btnSprim.addEventListener("click", async () => {

            const token = localStorage.getItem("token");

            const reponse = await fetch(`http://localhost:3000/api/users/${user.id}`, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token }
            });

            const data = await reponse.json();

            chargerUser();
            chargerStats()
        });




        // Modifier : ouvre le formulaire caché pré-rempli
        btnModif.addEventListener("click", () => {

            document.getElementById("modifNomUser").value = user.nom;
            document.getElementById("modifUsernameUser").value = user.username;
            document.getElementById("modifRole").value = user.role;

            const overlay = document.querySelector(".formulaireCacherUser");
            overlay.dataset.userId = user.id;
            overlay.style.display = "flex";
        });

        tbody.append(ligne);
    });
};



// Recuperation des boutoon de modification du menu cacher de l'utilisateur


const btnAnnuler = document.getElementById("btnAnnuler");
const btnSauvegarder = document.getElementById("btnSauvegarder");
const btnFermerModif = document.getElementById("btnFermerModif");


// Fermer sans sauvegarder
btnAnnuler.addEventListener("click", () => {
    document.querySelector(".formulaireCacherUser").style.display = "none";
});



btnFermerModif.addEventListener("click", () => {
    document.querySelector(".formulaireCacherUser").style.display = "none";
});


// Fermer en cliquant sur le fond sombre
document.querySelector(".formulaireCacherUser").addEventListener("click", (e) => {

    if (e.target.classList.contains("formulaireCacherUser")) {
        document.querySelector(".formulaireCacherUser").style.display = "none";
    }

});





// Sauvegarder la modification
btnSauvegarder.addEventListener("click", async () => {

    const id = document.querySelector(".formulaireCacherUser").dataset.userId;
    const nom = document.getElementById("modifNomUser").value;
    const username = document.getElementById("modifUsernameUser").value;
    const role = document.getElementById("modifRole").value;
    const token = localStorage.getItem("token");


    const reponse = await fetch(`http://localhost:3000/api/users/${id}`, {

        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },

        body: JSON.stringify({ nom, username, role })

    });

    const data = await reponse.json();

    if (!reponse.ok) {
        alert("Erreur : " + (data.error || data.erreur));
        return;
    }

    alert("Utilisateur modifié avec succès !");
    document.querySelector(".formulaireCacherUser").style.display = "none";

    chargerUser();
});





// Recherche par nom filtre en mémoire

const chercheParRoleEtNomUser = document.querySelector(".rechercheUser input");


chercheParRoleEtNomUser.addEventListener("input", function () {

    const texte = this.value.toLowerCase();

    const resultat = tousLesUser.filter(function (user) {
        return user.nom.toLowerCase().includes(texte);
    });

    afficherLignesUsers(resultat);
});






// Recherche par role filtre en mémoire

const rechRoleUser = document.querySelector(".rechRoleUser");


rechRoleUser.addEventListener("input", function () {

    const texte = this.value.toLowerCase();

    const resultat = tousLesUser.filter(function (user) {
        return user.role.toLowerCase().includes(texte);
    });

    afficherLignesUsers(resultat);
});



rechRoleUser.addEventListener("input", function () {

    const texte = this.value.toLowerCase();

    if (texte === "tous les rôles") {
        afficherLignesUsers(tousLesUser);
        return;
    };

    const resultat = tousLesUser.filter(function (user) {
        return user.role.toLowerCase().includes(texte);
    });

    afficherLignesUsers(resultat);
});








// Ajouter un utilisateur




const enregistreUser = document.getElementById("enregistreUser");

enregistreUser.addEventListener("click", async function () {

    const token = localStorage.getItem("token");
    const nom = document.getElementById("nomUser").value;
    const username = document.getElementById("usernameUser").value;
    const role = document.getElementById("roleUser").value;
    const password = document.getElementById("passwordUser").value;



    if (!nom.trim() || !username.trim() || !role.trim() || !password.trim()) {
        return alert("Tous les champs de création de l'utilisateur sont obligatoire")
    };


    const reponse = await fetch("http://localhost:3000/api/users", {

        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ nom, username, role, password })

    })

    const data = await reponse.json();



    if (!reponse.ok) {
        console.log("Erreur :", data.error || data.erreur);
        return;
    };


    alert(`Utilisateur ${data.username} ajouter avec succès`)

    console.log("Utilisateur créé :", data);


    document.getElementById("nomUser").value = "";
    document.getElementById("usernameUser").value = "";
    document.getElementById("roleUser").value = "";
    document.getElementById("passwordUser").value = "";

    // Chargement de la liste des utilisateur dans la bd

    chargerUser();
    chargerStats()

});










// RECUPERATION DE LA SECTION ETUDIANTE



//stat et recherche de etudiant 


//charger la base de donner des etudiant


let tousLesStudent = [];


const chargerStudent = async () => {

    const token = localStorage.getItem("token");

    const reponse = await fetch("http://localhost:3000/api/students", {
        headers: { "Authorization": "Bearer " + token }
    });

    const student = await reponse.json();

    tousLesStudent = student;

    afficherLignesStudents(tousLesStudent);
};





// Stats
const statTotalStudent = document.querySelector(".statTotalStudent");
const statStudentActif = document.querySelector(".statStudentActif");
const statStudentNew = document.querySelector(".statStudentNew");
const statStudentInactif = document.querySelector(".statStudentInactif");



const chargerStatsStudent = async () => {

    const token = localStorage.getItem("token");

    const reponse = await fetch("http://localhost:3000/api/students/stats", {
        headers: { "Authorization": "Bearer " + token }
    });

    const stats = await reponse.json();

    document.querySelector(".statTotalStudent").textContent = stats.total;
    document.querySelector(".statClasseStudent").textContent = stats.classes;
    document.querySelector(".statMoyenneStudent").textContent = stats.moyenne !== null ? `${stats.moyenne}/20` : "N/A";


};






// Recherche par nom
document.querySelector(".rechercheStudent input").addEventListener("input", function () {
    const texte = this.value.toLowerCase();
    const resultat = tousLesStudent.filter(s => s.nom.toLowerCase().includes(texte));
    afficherLignesStudents(resultat);
});

// Filtre par classe
document.querySelector(".rechClasseStudent").addEventListener("change", function () {
    const texte = this.value.toLowerCase();
    if (texte === "toutes les classes") {
        afficherLignesStudents(tousLesStudent);
        return;
    }
    const resultat = tousLesStudent.filter(s => s.classe.toLowerCase().includes(texte));
    afficherLignesStudents(resultat);
});



// Utilisation de la zone de recherche pour chaque element 

const rechercheStudent = document.querySelector(".rechercheStudent input");
const rechClasseStudent = document.querySelector(".rechClasseStudent");




rechercheStudent.addEventListener("input", function () {

    const texte = this.value.toLowerCase();

    const resultat = tousLesStudent.filter(function (student) {
        return (student.nom || "").toLowerCase().includes(texte) || (student.matricule || "").toLowerCase().includes(texte);
    });

    afficherLignesStudents(resultat);
});



rechClasseStudent.addEventListener("input", function () {

    const texte = this.value.toLowerCase();

    if (texte === "tous les classes") {
        afficherLignesUsers(tousLesStudent);
        return;
    };

    const resultat = tousLesStudent.filter(function (student) {
        return student.classe.toLowerCase().includes(texte);
    });

    afficherLignesStudents(resultat);
});


// Recherche d'un etudiant par sont matricule 







// fonction de recharge de la liste des utilisateur avec les bouton d'action modif et suprim


const afficherLignesStudents = (liste) => {

    const tbody = document.getElementById("listeStdent");

    tbody.innerHTML = "";

    liste.forEach(function (student) {

        const ligne = document.createElement("tr");

        ligne.innerHTML = `
                <div class="panneau_formulaire">

                    <td>${student.id}</td>
                    <td>${student.matricule}</td>
                    <td>${student.nom}</td>
                    <td>${student.prenom}</td>
                    <td>${student.age}</td>
                    <td>${student.classe}</td>
                    

                    <td>

                        <div class="actions_ligne">

                            <button class="btn_action modifier " ><i class="fa-solid fa-pen"></i></button>
                            <button class="btn_action supprimer " ><i class="fa-solid fa-trash"></i></button>
                        
                        </div>

                    </td>

                </div>

        `;



        // Recuperation des bouton du formulaire cahé de modification

        const btnModif = ligne.querySelector(".modifier");
        const btnSprim = ligne.querySelector(".supprimer");



        // Supprimer un utilisateur
        btnSprim.addEventListener("click", async () => {

            const token = localStorage.getItem("token");

            const reponse = await fetch(`http://localhost:3000/api/students/${student.id}`, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token }
            });

            const data = await reponse.json();

            chargerStudent();
            chargerStatsStudent();
        });




        // Modifier : ouvre le formulaire caché pré-rempli
        btnModif.addEventListener("click", () => {

            document.getElementById("modifmatricule").value = student.matricule;
            document.getElementById("modifNomStudent").value = student.nom;
            document.getElementById("modifPrenomStudent").value = student.prenom;
            document.getElementById("modifAgesStdent").value = student.age;
            document.getElementById("modifStudiantClasse").value = student.classe;



            const overlay = document.querySelector(".formulaireCacherStudent");
            overlay.dataset.studentId = student.id;
            overlay.style.display = "flex";
        });

        tbody.append(ligne);
    });
};







// Recuperation des boutoon de modification du menu cacher de l'utilisateur


const modifAnnulStdent = document.getElementById("AnnulerStudent");
const modifSauvStudent = document.getElementById("modifSauvStudent");
const btnFermEtu = document.querySelector(".btn_fermStudent");


// Fermer sans sauvegarder
modifAnnulStdent.addEventListener("click", () => {
    document.querySelector(".formulaireCacherStudent").style.display = "none";
});



btnFermEtu.addEventListener("click", () => {
    document.querySelector(".formulaireCacherStudent").style.display = "none";
});


// Fermer en cliquant sur le fond sombre
document.querySelector(".formulaireCacherStudent").addEventListener("click", (e) => {

    if (e.target.classList.contains("formulaireCacherStudent")) {
        document.querySelector(".formulaireCacherStudent").style.display = "none";
    }

});





// Sauvegarder la modification
modifSauvStudent.addEventListener("click", async () => {

    const id = document.querySelector(".formulaireCacherStudent").dataset.studentId;
    const matricule = document.getElementById("modifmatricule").value;
    const nom = document.getElementById("modifNomStudent").value;
    const prenom = document.getElementById("modifPrenomStudent").value;
    const age = document.getElementById("modifAgesStdent").value;
    const classe = document.getElementById("modifStudiantClasse").value;
    const token = localStorage.getItem("token");


    const reponse = await fetch(`http://localhost:3000/api/students/${id}`, {

        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },

        body: JSON.stringify({ matricule, nom, prenom, age, classe, username })

    });

    const data = await reponse.json();

    if (!reponse.ok) {
        alert("Erreur : " + (data.error || data.erreur));
        return;
    }

    alert("Utilisateur modifié avec succès !");
    document.querySelector(".formulaireCacherStudent").style.display = "none";

    chargerStudent();
    chargerStatsStudent();
});





// Ajouter un etudiant



const btn_enregistreStudent = document.getElementById("btn_enregistreStudent");

btn_enregistreStudent.addEventListener("click", async function () {

    const token = localStorage.getItem("token");
    const matricule = document.getElementById("etudiantMatricule").value;
    const nom = document.getElementById("etudiantNom").value;
    const prenom = document.getElementById("etudiantPrenom").value;
    const age = document.getElementById("etudiantAge").value;
    const classe = document.getElementById("etudiantClasse").value;
    const username = document.getElementById("etudiantUsername").value;
    const password = document.getElementById("etudiantPassword").value;

    if (!matricule.trim() || !nom.trim() || !prenom.trim() || !age.trim() || !classe.trim() || !username.trim()) {
        return alert("Tous les champs de création de l'étudiant sont obligatoires");
    };

    const reponse = await fetch("http://localhost:3000/api/students", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ matricule, nom, prenom, age, classe, status, username, password })
    });

    const data = await reponse.json();

    if (!reponse.ok) {
        console.log("Erreur :", data.error || data.erreur);
        return;
    };

    alert(`Étudiant ${data.nom} ${data.prenom} ajouté avec succès`);

    document.getElementById("etudiantMatricule").value = "";
    document.getElementById("etudiantNom").value = "";
    document.getElementById("etudiantPrenom").value = "";
    document.getElementById("etudiantAge").value = "";
    document.getElementById("etudiantClasse").value = "";
    document.getElementById("etudiantUsername").value = "";

    chargerStudent();
    chargerStatsStudent()

});








// RECUPERATION DE LA SECTION PROFESSEUR



// Stats
const statTotalProf = document.querySelector(".statTotalProf");
const statProfMatiere = document.querySelector(".statProfMatiere");
const statProfNouveaux = document.querySelector(".statProfNouveaux");
const statProfInactif = document.querySelector(".statProfInactif");


const chargerStatsProf = async () => {
    const token = localStorage.getItem("token");

    const reponse = await fetch("http://localhost:3000/api/statis/professeurs/stats", {
        headers: { "Authorization": "Bearer " + token }
    });

    const stats = await reponse.json();

    document.querySelector(".statTotalProf").textContent = stats.total;
};



// Recherche par nom
const rechercheProf = document.querySelector(".rechercheProf input");
const rechMatiereProf = document.querySelector(".rechMatiereProf");

rechercheProf.addEventListener("input", function () {
    const texte = this.value.toLowerCase();

    const resultat = tousLesProf.filter(function (prof) {
        return (teachers.nom || "").toLowerCase().includes(texte);
    });

    afficherLignesProf(resultat);
});


// Recherche par matière
rechMatiereProf.addEventListener("change", function () {
    const texte = this.value.toLowerCase();

    if (texte === "toutes les matières") {
        afficherLignesProf(tousLesProf);
        return;
    };

    const resultat = tousLesProf.filter(function (prof) {
        return (teachers.matiere || "").toLowerCase().includes(texte);
    });

    afficherLignesProf(resultat);
});






// chargement des element de la base de donner vers l'interface grafique

let tousLesProf = [];

const chargerProf = async () => {
    const token = localStorage.getItem("token");

    const reponse = await fetch("http://localhost:3000/api/teachers", {
        headers: { "Authorization": "Bearer " + token }
    });

    const prof = await reponse.json();

    tousLesProf = prof;

    afficherLignesProf(tousLesProf);
};



// Afficher les listes des professeurs
const afficherLignesProf = (liste) => {

    const tbody = document.getElementById("listeProf");

    tbody.innerHTML = "";

    liste.forEach(function (teachers) {

        const ligne = document.createElement("tr");

        ligne.innerHTML = `

            <td>${teachers.id}</td>
            <td>${teachers.nom}</td>
            <td>${teachers.matiere || "Non assignée"}</td>
            
            <td>
                <div class="actions_ligne">
                    <button class="btn_action modifier"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn_action supprimer"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>

        `;

        const btnModif = ligne.querySelector(".modifier");
        const btnSprim = ligne.querySelector(".supprimer");


        // Supprimer un professeur
        btnSprim.addEventListener("click", async () => {
            const token = localStorage.getItem("token");

            const reponse = await fetch(`http://localhost:3000/api/teachers/${teachers.id}`, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token }
            });

            const data = await reponse.json();

            chargerProf();
            chargerStatsProf();
        });



        // Modifier — ouvre le formulaire caché pré-rempli

        btnModif.addEventListener("click", async () => {

            const token = localStorage.getItem("token");

            // Charger les matières depuis la BD
            const reponse = await fetch("http://localhost:3000/api/subjects", {
                headers: { "Authorization": "Bearer " + token }
            });
            const matieres = await reponse.json();

            // Remplir le select
            const select = document.getElementById("modifMatiereProf");

            select.innerHTML = "";

            matieres.forEach(function (matiere) {

                const option = document.createElement("option");
                option.value = matiere.id;
                option.textContent = matiere.nom;
                select.appendChild(option);

            });

            // Pré-sélectionner la matière actuelle
            select.value = teachers.subject_id;

            // Remplir les autres champs
            document.getElementById("modifNomProf").value = teachers.nom;

            const overlay = document.querySelector(".formulaireCacherProf");
            overlay.dataset.teacherId = teachers.id;
            overlay.style.display = "flex";

        });



        tbody.append(ligne);
    });
};




// Boutons du formulaire caché de modification
const modifAnnulProf = document.getElementById("AnnulerProf");
const modifSauvProf = document.getElementById("modifSauvProf");
const btnFermProf = document.querySelector(".btn_fermProf");

// Fermer sans sauvegarder
modifAnnulProf.addEventListener("click", () => {
    document.querySelector(".formulaireCacherProf").style.display = "none";
});

btnFermProf.addEventListener("click", () => {
    document.querySelector(".formulaireCacherProf").style.display = "none";
});

// Fermer en cliquant sur le fond sombre
document.querySelector(".formulaireCacherProf").addEventListener("click", (e) => {
    if (e.target.classList.contains("formulaireCacherProf")) {
        document.querySelector(".formulaireCacherProf").style.display = "none";
    }
});



// Sauvegarder la modification
modifSauvProf.addEventListener("click", async () => {

    const id = document.querySelector(".formulaireCacherProf").dataset.teacherId;
    const nom = document.getElementById("modifNomProf").value;
    const subject_id = document.getElementById("modifMatiereProf").value;
    const token = localStorage.getItem("token");

    const reponse = await fetch(`http://localhost:3000/api/teachers/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ nom, subject_id })
    });

    const data = await reponse.json();

    if (!reponse.ok) {
        alert("Erreur : " + (data.error || data.erreur));
        return;
    }

    alert("Professeur modifié avec succès !");
    document.querySelector(".formulaireCacherProf").style.display = "none";

    chargerProf();
    chargerStatsProf();
});





// Ajouter un professeur
const btn_enregistreProf = document.getElementById("btn_enregistreProf");

btn_enregistreProf.addEventListener("click", async function () {
    const token = localStorage.getItem("token");
    const nom = document.getElementById("nomProf").value;
    const matiere = document.getElementById("profMatiere").value;
    const username = document.getElementById("profUsername").value;
    const password = document.getElementById("profPassword").value;

    if (!nom.trim() || !matiere.trim() || !username.trim() || !password.trim()) {
        return alert("Tous les champs de création du professeur sont obligatoires");
    };

    const reponse = await fetch("http://localhost:3000/api/teachers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ nom, matiere, username, password })
    });

    const data = await reponse.json();

    if (!reponse.ok) {
        console.log("Erreur :", data.error || data.erreur);
        return;
    };

    alert(`Professeur ${data.nom} ajouté avec succès`);

    document.getElementById("nomProf").value = "";
    document.getElementById("profMatiere").value = "";
    document.getElementById("profUsername").value = "";
    document.getElementById("profPassword").value = "";

    chargerProf();
    chargerStatsProf();
});


// Bouton annuler du formulaire d'ajout

const btn_annulProf = document.querySelector(".btn_annulProf")

btn_annulProf.addEventListener("click", function () {

    document.getElementById("nomProf").value = "";
    document.getElementById("profMatiere").value = "";
    document.getElementById("profUsername").value = "";
    document.getElementById("profPassword").value = "";

});











// RECUPERATION DE LA SECTION MATIERE



// Stats
const statTotalMatiere = document.querySelector(".statTotalMatiere");
const statMatiereAssignee = document.querySelector(".statMatiereAssignee");
const statMatiereNonAssignee = document.querySelector(".statMatiereNonAssignee");



const chargerStatsMatiere = async () => {
    const token = localStorage.getItem("token");

    const reponse = await fetch("http://localhost:3000/api/statis/matieres/stats", {
        headers: { "Authorization": "Bearer " + token }
    });

    const stats = await reponse.json();

    document.querySelector(".statTotalMatiere").textContent = stats.total;
};







// chargement des element de la base de donner vers l'interface grafique

let tousLesMatiere = [];

const chargerMartiere = async () => {
    const token = localStorage.getItem("token");

    const reponse = await fetch("http://localhost:3000/api/subjects", {
        headers: { "Authorization": "Bearer " + token }
    });

    const matiere = await reponse.json();

    tousLesMatiere = matiere;

    afficherLignesMatiere(tousLesMatiere);
};



// Afficher les listes des professeurs
const afficherLignesMatiere = (liste) => {

    const tbody = document.getElementById("listeMatieres");

    tbody.innerHTML = "";

    liste.forEach(function (subjects) {

        const ligne = document.createElement("tr");

        ligne.innerHTML = `

            <td>${subjects.id}</td>
            <td>${subjects.nom}</td>
            <td>${subjects.teacher_nom || "Non assignée"}</td>
            
            <td>
                <div class="actions_ligne">
                    <button class="btn_action modifier"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn_action supprimer"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>

        `;

        const btnModif = ligne.querySelector(".modifier");
        const btnSprim = ligne.querySelector(".supprimer");


        // Supprimer un professeur
        btnSprim.addEventListener("click", async () => {
            const token = localStorage.getItem("token");

            const reponse = await fetch(`http://localhost:3000/api/subjects/${subjects.id}`, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token }
            });

            const data = await reponse.json();

            chargerMartiere();
            chargerStatsMatiere();
        });



        // Modifier — ouvre le formulaire caché pré-rempli

        btnModif.addEventListener("click", async () => {

            const token = localStorage.getItem("token");

            // Charger les matières depuis la BD
            const reponse = await fetch("http://localhost:3000/api/teachers", {
                headers: { "Authorization": "Bearer " + token }
            });
            const matieres = await reponse.json();

            // Remplir le select
            const select = document.getElementById("modifProfMatiere");

            select.innerHTML = "";

            matieres.forEach(function (professeur) {

                const option = document.createElement("option");
                option.value = professeur.id;
                option.textContent = professeur.nom;
                select.appendChild(option);

            });

            // Pré-sélectionner la matière actuelle
            select.value = subjects.teacher_id;

            // Remplir les autres champs
            document.getElementById("modifNomMatiere").value = subjects.nom;

            const overlay = document.querySelector(".formulaireCacherMatiere");
            overlay.dataset.subjectId = subjects.id;
            overlay.style.display = "flex";

        });



        tbody.append(ligne);
    });
};









// Boutons du formulaire caché de modification
const AnnulerMatiere = document.getElementById("AnnulerMatiere");
const modifSauvMatiere = document.getElementById("modifSauvMatiere");
const btnFermMatiere = document.querySelector(".btn_fermMatiere");

// Fermer sans sauvegarder
AnnulerMatiere.addEventListener("click", () => {
    document.querySelector(".formulaireCacherMatiere").style.display = "none";
});

btnFermMatiere.addEventListener("click", () => {
    document.querySelector(".formulaireCacherMatiere").style.display = "none";
});

// Fermer en cliquant sur le fond sombre
document.querySelector(".formulaireCacherMatiere").addEventListener("click", (e) => {
    if (e.target.classList.contains("formulaireCacherMatiere")) {
        document.querySelector(".formulaireCacherMatiere").style.display = "none";
    }
});



// Sauvegarder la modification
modifSauvMatiere.addEventListener("click", async () => {

    const id = document.querySelector(".formulaireCacherMatiere").dataset.subjectId;
    const nom = document.getElementById("modifNomMatiere").value;
    const teacher_id = document.getElementById("modifProfMatiere").value;
    const token = localStorage.getItem("token");

    const reponse = await fetch(`http://localhost:3000/api/subjects/${id}`, {

        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ nom, teacher_id })

    });

    const data = await reponse.json();

    if (!reponse.ok) {
        alert("Erreur : " + (data.error || data.erreur));
        return;
    }

    alert("Matière modifié avec succès !");
    document.querySelector(".formulaireCacherMatiere").style.display = "none";

    chargerMartiere();
    chargerStatsMatiere();
});






// Ajouter un professeur
const btn_enregistreMatiere = document.getElementById("btn_enregistreMatiere");

btn_enregistreMatiere.addEventListener("click", async function () {

    const token = localStorage.getItem("token");
    const nom = document.getElementById("nomMatiere").value;
    


    if (!nom.trim()) {
        return alert("Tous les champs de création de la matiere sont obligatoires");
    };

    const reponse = await fetch("http://localhost:3000/api/subjects", {

        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },

        body: JSON.stringify({ nom})

    });

    const data = await reponse.json();

    if (!reponse.ok) {
        console.log("Erreur :", data.error || data.erreur);
        return;
    };

    alert(`Professeur ${data.nom} ajouté avec succès`);

    document.getElementById("nomMatiere").value = "";
    document.getElementById("idProfesseur").value = "";


    chargerMartiere();
    chargerStatsMatiere();
});


// Bouton annuler du formulaire d'ajout

const btn_annulMatiere = document.querySelector(".btn_annulMatiere")

btn_annulMatiere.addEventListener("click", function () {

    document.getElementById("nomMatiere").value = "";
    document.getElementById("idProfesseur").value = "";


});


































// Chargement de la liste des utilisateur dans la bd

chargerUser();
chargerStats();
chargerStudent();
chargerStatsStudent();
chargerProf();
chargerStatsProf();
chargerMartiere();
chargerStatsMatiere();