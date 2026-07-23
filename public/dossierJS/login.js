
let username = document.querySelector("#user_name");
let password = document.querySelector("#champMotDePasse");


let formulaire = document.querySelector("#formulaireConnexion");
let messageErreur = document.getElementById("messageErreur");

let profilActuel = null;


// Quand on soumet le formulaire
formulaire.addEventListener("submit", async function (evenement) {

    // On empeche la page de se recharger
    evenement.preventDefault();


    let identifiant = username.value.trim();
    let motDePasse = password.value.trim();


    if (identifiant === "" || motDePasse === "") {

        messageErreur.textContent = "Veuillez remplir tous les champs.";
        messageErreur.style.display = "block";
        return;

    }

    if (motDePasse.length > 10) {

        messageErreur.textContent = "Le mot de passe doit contenir au moins 10 caracteres.";
        messageErreur.style.display = "block";
        return;

    }

    messageErreur.style.display = "none";



    const donnees = identifiant.toUpperCase().startsWith("MAT") ? { matricule: identifiant, password: motDePasse } : {identifiant: identifiant, password: motDePasse };

    const reponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(donnees)
    });


    const resultat = await reponse.json();


    if (reponse.ok){

        alert(`Connexion réussie : ${resultat.role}`);
        console.log(`Connexion réussie : ${resultat.message_}`);

    } else {

        messageErreur.textContent = resultat.message;
        messageErreur.style.display = "block";

    }


});