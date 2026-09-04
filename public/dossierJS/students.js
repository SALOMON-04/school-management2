protegePages("etudiant");

const API = "";

// TOKEN ET UTILITAIRES 

const token = localStorage.getItem("token");

// Récupère le user_id depuis le token JWT
function getStudentIdFromToken() {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
}

// Récupère le profil complet de l'étudiant connecté depuis la BD
const getStudentReel = async () => {
    const user_id = getStudentIdFromToken();
    const reponse = await fetch(`${API}/api/students/user/${user_id}`, {
        headers: { "Authorization": "Bearer " + token }
    });
    return await reponse.json();
};


// NAVIGATION 

// Affiche la section cliquée et masque les autres
function afficherSection(element) {
    document.querySelectorAll('.page_section').forEach(s => s.style.display = 'none');
    document.getElementById(element.getAttribute('data-section')).style.display = 'block';
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    element.classList.add('active');
}

document.querySelectorAll('.nav-item[data-section]').forEach(function (item) {
    item.addEventListener('click', function () { afficherSection(item); });
});


//  NOTES

// Récupère et affiche les notes de l'étudiant connecté
const chargerNotesEtudiant = async () => {
    const student = await getStudentReel();

    const reponse = await fetch(`${API}/api/grades/student/${student.id}`, {
        headers: { "Authorization": "Bearer " + token }
    });

    const notes = await reponse.json();
    afficherLignesNotesEtudiant(notes);
    mettreAJourStatsNotes(notes);
};

// Injecte les lignes du tableau des notes
const afficherLignesNotesEtudiant = (liste) => {
    const tbody = document.getElementById("listeNotesEtudiant");
    if (!tbody) return;
    tbody.innerHTML = "";

    liste.forEach(function (grade) {
        const ligne = document.createElement("tr");
        ligne.innerHTML = `
            <td>${grade.subject_id}</td>
            <td>${grade.subject_nom || ""}</td>
            <td><span class="badge ${grade.note >= 10 ? 'actif' : 'inactif'}">${grade.note}/20</span></td>
        `;
        tbody.append(ligne);
    });
};

// Met à jour les cartes de stats des notes
const mettreAJourStatsNotes = (notes) => {
    if (!notes.length) return;

    const moyenne = notes.reduce((acc, n) => acc + n.note, 0) / notes.length;
    const meilleure = Math.max(...notes.map(n => n.note));
    const matieres = new Set(notes.map(n => n.subject_id)).size;

    const statMoyenne = document.querySelector(".statMoyenneEtudiant");
    const statMeilleure = document.querySelector(".statMeilleureEtudiant");
    const statMatieres = document.querySelector(".statMatieresEtudiant");

    if (statMoyenne) statMoyenne.textContent = `${moyenne.toFixed(2)}/20`;
    if (statMeilleure) statMeilleure.textContent = `${meilleure}/20`;
    if (statMatieres) statMatieres.textContent = matieres;
};


//  ABSENCES 

// Récupère et affiche les absences de l'étudiant connecté
const chargerAbsencesEtudiant = async () => {
    const student = await getStudentReel();

    const reponse = await fetch(`${API}/api/absences/student/${student.id}`, {
        headers: { "Authorization": "Bearer " + token }
    });

    const absences = await reponse.json();
    afficherLignesAbsencesEtudiant(absences);
    mettreAJourStatsAbsences(absences);
};

// Injecte les lignes du tableau des absences
const afficherLignesAbsencesEtudiant = (liste) => {
    const tbody = document.getElementById("listeAbsencesEtudiant");
    if (!tbody) return;
    tbody.innerHTML = "";

    liste.forEach(function (absence) {
        const ligne = document.createElement("tr");
        ligne.innerHTML = `
            <td>${absence.date}</td>
            <td><span class="badge ${absence.status === 'justifiee' ? 'justifie' : 'non_justifie'}">${absence.status === 'justifiee' ? 'Justifié' : 'Non justifié'}</span></td>
        `;
        tbody.append(ligne);
    });
};

// Met à jour les cartes de stats des absences
const mettreAJourStatsAbsences = (absences) => {
    const total = absences.length;
    const justifiees = absences.filter(a => a.status === 'justifiee').length;
    const nonJust = total - justifiees;

    const statTotal = document.querySelector(".statTotalAbsenceEtudiant");
    const statJust = document.querySelector(".statJustifieEtudiant");
    const statNonJust = document.querySelector(".statNonJustifieEtudiant");

    if (statTotal) statTotal.textContent = total;
    if (statJust) statJust.textContent = justifiees;
    if (statNonJust) statNonJust.textContent = nonJust;
};


//  PROFIL 

// Charge et affiche les informations du profil de l'étudiant connecté
const chargerProfilEtudiant = async () => {
    const student = await getStudentReel();

    document.querySelector(".nom_profil").textContent = `${student.prenom} ${student.nom}`;
    document.querySelector(".sous_texte_profil").textContent = `Étudiant - ${student.classe}`;
    document.querySelector(".avatar_grand").textContent = `${student.prenom[0]}${student.nom[0]}`.toUpperCase();

    const infos = document.querySelectorAll(".valeur_info");
    if (infos[0]) infos[0].textContent = student.matricule;
    if (infos[1]) infos[1].textContent = student.nom;
    if (infos[2]) infos[2].textContent = student.prenom;
    if (infos[3]) infos[3].textContent = `${student.age} ans`;
    if (infos[4]) infos[4].textContent = student.classe;
};


// TABLEAU DE BORD 

// Charge les dernières notes et absences pour le tableau de bord
const chargerAccueilEtudiant = async () => {
    const student = await getStudentReel();

    // Dernières notes
    const repNotes = await fetch(`${API}/api/grades/studentId/${student.id}`, {
        headers: { "Authorization": "Bearer " + token }
    });
    const notes = await repNotes.json();

    const tbodyNotes = document.getElementById("dernieresNotesEtudiant");
    if (tbodyNotes) {
        tbodyNotes.innerHTML = "";
        notes.slice(0, 3).forEach(function (grade) {
            const ligne = document.createElement("tr");
            ligne.innerHTML = `
                <td>${grade.subject_nom || ""}</td>
                <td>${grade.note}/20</td>
            `;
            tbodyNotes.append(ligne);
        });
    }

    // Dernières absences
    const repAbs = await fetch(`${API}/api/grades/student/${student.id}`, {
        headers: { "Authorization": "Bearer " + token }
    });
    const absences = await repAbs.json();

    const divAbsences = document.getElementById("dernieresAbsencesEtudiant");
    if (divAbsences) {
        divAbsences.innerHTML = "";
        absences.slice(0, 2).forEach(function (absence) {
            const color = absence.status === 'justifiee' ? '#1DAA4A' : '#E0433D';
            const icon = absence.status === 'justifiee' ? 'fa-check' : 'fa-xmark';
            const texte = absence.status === 'justifiee' ? 'Justifiée' : 'Non justifiée';

            divAbsences.innerHTML += `
                <div class="activity-item">
                    <div class="activity-dot" style="background:${color};">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div>
                        <div class="activity-text">${texte}</div>
                        <div class="activity-time">${absence.date}</div>
                    </div>
                </div>
            `;
        });
    }
};


//  LANCEMENT 

chargerAccueilEtudiant();
chargerNotesEtudiant();
chargerAbsencesEtudiant();
chargerProfilEtudiant();



//DECONNEXION
document.querySelector(".logout").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../dossierhtml/index.html";
});
