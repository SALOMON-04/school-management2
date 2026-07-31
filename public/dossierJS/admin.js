protegePages("admin");









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


