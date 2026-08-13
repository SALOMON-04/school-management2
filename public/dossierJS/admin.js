


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






// Chargement de la liste dans la bd user



// const zone_gestion = document.querySelector(".zone_gestion");
// zone_gestion.style.display = "grid";
// zone_gestion.style.gridTemplateTolumns = "1fr 340px";
// zone_gestion.style.alignItems = "flex-start";
// // const gestionUser = document.querySelector(".gestionUser");
// // gestionUser.style.display = "flex";




const chargerUser = async () => {

    const token = localStorage.getItem("token");

    const reponse = await fetch("http://localhost:3000/api/users", {

        headers: { "Authorization": "Bearer " + token }
    });

    const utilisateur = await (reponse).json();


    const tbody = document.getElementById("listeUsers");

    tbody.innerHTML = "";


    utilisateur.forEach(function (user) {

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


        // recupération des bouton et afichage du menu cahé de la modification

        const btnModif = ligne.querySelector(".btn_modiUsers");
        const btnSprim = ligne.querySelector(".btn_supprimerUser");



        // Suupprimer un utilisateir 
        btnSprim.addEventListener('click', async () => {

            const token = localStorage.getItem("token");

            const reponse = await fetch(`http://localhost:3000/api/users/${user.id}`, {

                method: "DELETE",
                headers: { "Authorization": "Bearer " + token }
            });

            const data = await reponse.json();

            chargerUser();
        });



        //Modifier un utilisateur

        btnModif.addEventListener('click', async (e) => {


            document.getElementById("modifNomUser").value = user.nom;
            document.getElementById("modifUsernameUser").value = user.username;
            document.getElementById("modifRole").value = user.role;



            const overlay = document.querySelector(".formulaireCacherUser");
            overlay.dataset.userId = user.id;
            overlay.style.display = "flex";


        });


        tbody.append(ligne);

    });



    // Formulaire caché de modification

    const btnAnnuler = document.getElementById("btnAnnuler");
    const btnSauvegarder = document.getElementById("btnSauvegarder");
    const btnFermerModif = document.getElementById("btnFermerModif");



    // Fermer sans sauvegarder
    btnAnnuler.addEventListener("click", () => {
        document.querySelector(".formulaireCacherUser").style.display = "none";
    });


    btnFermerModif.addEventListener("click", () => {

        document.getElementById(".formulaireCacherUser").style.display = "none";
    })

    // Fermer en cliquant sur le fond sombre
    document.querySelector(".formulaireCacherUser").addEventListener("click", (e) => {
        if (e.target.id === ".formulaireCacherUser") {
            document.getElementById(".formulaireCacherUser").style.display = "none";
        }
    });





    // Sauvegarder de la modification
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
        document.getElementById("formModifUser").style.display = "none";

        chargerUser();
    });


};







// SECTION UTLISATEUR association du front au back a traver les routes




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

});
















// Chargement de la liste des utilisateur dans la bd

chargerUser();