const formulaire = document.querySelector("#formulaire");
const username = document.querySelector("#username");
const password = document.querySelector("#champMotDePasse");
const messageErreur = document.querySelector("#messageErreur");


formulaire.addEventListener("submit", async function (evenement) {

    evenement.preventDefault();

    const identifiant = username.value.trim();
    const motDePasse = password.value.trim();

    if (identifiant === "" || motDePasse === "") {
        messageErreur.textContent = "Veuillez remplir tous les champs.";
        messageErreur.style.display = "block";
        return;
    }

    messageErreur.style.display = "none";

    // Si ça ressemble à un matricule (étudiant), sinon c'est un username (admin/prof)
    const donnees = identifiant.toUpperCase().startsWith("MAT")
        ? { matricule: identifiant, password: motDePasse }
        : { identifiant: identifiant, password: motDePasse };

    try {
        const reponse = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(donnees)
        });

        const resultat = await reponse.json();

        if (!reponse.ok) {
            messageErreur.textContent = resultat.error;
            messageErreur.style.display = "block";
            return;
        }

        // Connexion réussie : on stocke les infos pour les autres pages
        localStorage.setItem("token", resultat.token);
        localStorage.setItem("id", resultat.id);
        localStorage.setItem("nom", resultat.nom);
        localStorage.setItem("role", resultat.role);

        // Redirection selon le rôle réel reçu du serveur
        if (resultat.role === "admin") {
            window.location.href = "../dossierhtml/admin.html";
        } else if (resultat.role === "professeur") {
            window.location.href = "../dossierhtml/teachers.html";
        } else if (resultat.role === "etudiant") {
            window.location.href = "../dossierhtml/students.html";
        }

    } catch (erreur) {
        messageErreur.textContent = "Erreur de connexion au serveur.";
        messageErreur.style.display = "block";
    }

});



