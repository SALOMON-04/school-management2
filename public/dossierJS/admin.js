let boutonAdmin = document.querySelector(".bouton_admin");
let boutonProf = document.querySelector(".bouton_prof");
let boutonEtudiant = document.querySelector(".bouton_etudiant");


let mouv_slide = document.querySelector("#curseur");
let labelIdentifiant = document.querySelector("#identifiant");
let userName = document.querySelector("#user_name");



let formulaire = document.querySelector("#formulaireConnexion");
let champMotDePasse = document.getElementById("champMotDePasse");
let messageErreur = document.getElementById("messageErreur");


// Cette variable retient quel profil est actuellement choisi
let profilActuel = "admin";



// Fonction appelee a chaque fois qu'on change de profil
function changerProfil(profil, bouton, positionCurseur) {

    // On enleve la couleur active des 3 boutons
    boutonAdmin.classList.remove("actif");
    boutonProf.classList.remove("actif");
    boutonEtudiant.classList.remove("actif");


    bouton.classList.add("actif");


    mouv_slide.style.left = positionCurseur;

    // On garde en memoire le profil choisi
    profilActuel = profil;



    // On change le texte du label selon le profil
    if (profil === "etudiant") {

        labelIdentifiant.textContent = "Matricule";
        userName.placeholder = "Entrez votre matricule";

    } else {

        labelIdentifiant.textContent = "Nom d'utilisateur";
        userName.placeholder = "Entrez votre nom d'utilisateur";

    }

    // On vide le champ et on cache le message d'erreur
    userName.value = "";
    messageErreur.style.display = "none";
}





// Quand on clique sur le bouton Admin
boutonAdmin.addEventListener("click", function () {
    changerProfil("admin", boutonAdmin, "4px");
});


// Quand on clique sur le bouton Prof
boutonProf.addEventListener("click", function () {
    changerProfil("professeur", boutonProf, "114px");
});


// Quand on clique sur le bouton Etudiant
boutonEtudiant.addEventListener("click", function () {
    changerProfil("etudiant", boutonEtudiant, "224px");
});





boutonAdmin.classList.add("actif");







// Quand on soumet le formulaire
formulaire.addEventListener("submit", async function (evenement) {

    // On empeche la page de se recharger
    evenement.preventDefault();


    let identifiant = userName.value.trim();
    let motDePasse = champMotDePasse.value.trim();


    if (identifiant === "" || motDePasse === "") {

        messageErreur.textContent = "Veuillez remplir tous les champs.";
        messageErreur.style.display = "block";

    } else if (motDePasse.length < 6) {

        messageErreur.textContent = "Le mot de passe doit contenir au moins 6 caracteres.";
        messageErreur.style.display = "block";

    } else {
        messageErreur.style.display = "none";


        let donnees;
        let reponse;
        let resultat;

        if (profilActuel === "etudiant") {

            donnees = { matricule: identifiant, password: motDePasse }

            reponse = await fetch("./api/authan/login-etudiant", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(donnees)

            })

            

            resultat = await reponse.json();

        } else {

            donnees = { username: identifiant, password: motDePasse, role: profilActuel };



            reponse = await fetch("./login", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(donnees)

            })

            resultat = await reponse.json();
        }


        console.log(donnees);
        // // Ici on pourra plus tard envoyer les donnees au serveur
        // console.log("Profil :", profilActuel);
        // console.log("Identifiant :", identifiant);
        // console.log("Mot de passe :", motDePasse);

        alert("Connexion en cours en tant que " + profilActuel + "...");
    }
});