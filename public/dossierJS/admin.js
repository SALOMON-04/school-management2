


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

    statUser.textContent  = stats.total;
    statUserEtudiant.textContent = stats.etudiants;
    statUserProf .textContent = stats.professeurs;
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
















// Chargement de la liste des utilisateur dans la bd

chargerUser();
chargerStats()