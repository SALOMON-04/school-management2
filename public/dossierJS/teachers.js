protegePages("professeur");

const API = "" ;

//  TOKEN ET UTILITAIRES 

const token = localStorage.getItem("token");

// Récupère le user_id depuis le token JWT
function getTeacherIdFromToken() {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
}

// Récupère le profil complet du professeur connecté depuis la BD
const getTeacherReel = async () => {
    const user_id = getTeacherIdFromToken();
    const reponse = await fetch(`${API}/api/teachers/user/${user_id}`, {
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


//  STATUT ABSENCE 

// Met à jour l'apparence des boutons justifié/non justifié
function changerStatutProf(statut) {
    const btnJ = document.getElementById('btn_justifie');
    const btnNJ = document.getElementById('btn_non_justifie');
    btnJ.classList.remove('active');
    btnNJ.classList.remove('active');
    if (statut === 'justifie') {
        btnJ.classList.add('active');
    } else {
        btnNJ.classList.add('active');
    }
}


// NOTES 

// Stockage en mémoire des notes du prof
let tousLesNotesProf = [];

// Récupère les notes du prof depuis la BD et les affiche
const chargerNotesProf = async () => {
    const prof = await getTeacherReel();

    const reponse = await fetch(`${API}/api/grades/teacher/${prof.id}`, {
        headers: { "Authorization": "Bearer " + token }
    });

    const notes = await reponse.json();
    tousLesNotesProf = notes;
    afficherLignesNotesProf(tousLesNotesProf);
};

// Injecte les lignes du tableau des notes
const afficherLignesNotesProf = (liste) => {
    const tbody = document.getElementById("listeNotesProf");
    tbody.innerHTML = "";

    liste.forEach(function (grade) {
        const ligne = document.createElement("tr");
        ligne.innerHTML = `
            <td>${grade.student_id}</td>
            <td>${grade.nom || ""} ${grade.prenom || ""}</td>
            <td>${grade.classe || ""}</td>
            <td>${grade.note}/20</td>
            <td>
                <div class="actions_ligne">
                    <button class="btn_action modifier"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn_action supprimer"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;

        const btnModif = ligne.querySelector(".modifier");
        const btnSprim = ligne.querySelector(".supprimer");

        // Supprime la note et recharge la liste
        btnSprim.addEventListener("click", async () => {
            await fetch(`${API}/api/grades/${grade.id}`, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token }
            });
            chargerNotesProf();
        });

        // Ouvre la modale de modification pré-remplie
        btnModif.addEventListener("click", () => {
            document.getElementById("modifValeurNoteProf").value = grade.note;
            const overlay = document.querySelector(".formulaireCacherNoteProf");
            overlay.dataset.noteId = grade.id;
            overlay.style.display = "flex";
        });

        tbody.append(ligne);
    });
};


// MODALE MODIFICATION NOTE 

// Récupération des éléments de la modale note
const AnnulerNoteProf = document.getElementById("AnnulerNoteProf");
const modifSauvNoteProf = document.getElementById("modifSauvNoteProf");
const btnFermNoteProf = document.querySelector(".btn_fermNoteProf");

// Ferme la modale sans sauvegarder
AnnulerNoteProf.addEventListener("click", () => {
    document.querySelector(".formulaireCacherNoteProf").style.display = "none";
});

// Ferme via le bouton X
btnFermNoteProf.addEventListener("click", () => {
    document.querySelector(".formulaireCacherNoteProf").style.display = "none";
});

// Ferme en cliquant sur le fond sombre
document.querySelector(".formulaireCacherNoteProf").addEventListener("click", (e) => {
    if (e.target.classList.contains("formulaireCacherNoteProf")) {
        document.querySelector(".formulaireCacherNoteProf").style.display = "none";
    }
});

// Sauvegarde la modification de la note
modifSauvNoteProf.addEventListener("click", async () => {
    const id = document.querySelector(".formulaireCacherNoteProf").dataset.noteId;
    const note = document.getElementById("modifValeurNoteProf").value;

    const reponse = await fetch(`${API}/api/grades/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ note: Number(note) })
    });

    if (!reponse.ok) { alert("Erreur modification note"); return; }

    alert("Note modifiée !");
    document.querySelector(".formulaireCacherNoteProf").style.display = "none";
    chargerNotesProf();
});


// FORMULAIRE AJOUT NOTE

// Récupération des éléments du formulaire d'ajout note
const classeNoteProf = document.getElementById("classeNoteProf");
const etudiantNoteProf = document.getElementById("etudiantNoteProf");
const noteValeurProf = document.getElementById("noteValeurProf");
const btn_enregistreNoteProf = document.getElementById("btn_enregistreNoteProf");
const btnAnnulNoteProf = document.querySelector(".btnAnnulNoteProf");

// Charge les classes depuis la BD dans le select classe
const chargerClassesNoteProf = async () => {
    const reponse = await fetch(`${API}/api/students`, {
        headers: { "Authorization": "Bearer " + token }
    });
    const students = await reponse.json();
    const classes = [...new Set(students.map(s => s.classe))];

    classeNoteProf.innerHTML = '<option value="">Sélectionnez une classe</option>';
    classes.forEach(function (classe) {
        const option = document.createElement("option");
        option.value = classe;
        option.textContent = classe;
        classeNoteProf.appendChild(option);
    });
};

// Au changement de classe — charge les étudiants correspondants
classeNoteProf.addEventListener("change", async function () {
    const classe = this.value;
    etudiantNoteProf.innerHTML = '<option value="">Sélectionnez un étudiant</option>';
    if (!classe) return;

    const reponse = await fetch(`${API}/api/students`, {
        headers: { "Authorization": "Bearer " + token }
    });
    const students = await reponse.json();
    students.filter(s => s.classe === classe).forEach(function (student) {
        const option = document.createElement("option");
        option.value = student.id;
        option.textContent = `${student.prenom} ${student.nom}`;
        etudiantNoteProf.appendChild(option);
    });
});

// Enregistre une nouvelle note pour un étudiant
btn_enregistreNoteProf.addEventListener("click", async function () {
    const student_id = etudiantNoteProf.value;
    const note = noteValeurProf.value;

    // Récupère la matière du prof pour l'associer à la note
    const prof = await getTeacherReel();
    const subject_id = prof.subject_id;

    if (!student_id || !note) return alert("Tous les champs sont obligatoires");

    const reponse = await fetch("http://localhost:3000/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ student_id: Number(student_id), subject_id, note: Number(note) })
    });

    if (!reponse.ok) { alert("Erreur ajout note"); return; }

    alert("Note ajoutée !");
    etudiantNoteProf.value = "";
    noteValeurProf.value = "";
    chargerNotesProf();
});

// Vide le formulaire d'ajout note
btnAnnulNoteProf.addEventListener("click", function () {
    etudiantNoteProf.value = "";
    noteValeurProf.value = "";
});


//  ABSENCES 

// Stockage en mémoire des absences du prof
let tousLesAbsencesProf = [];

// Récupère les absences des élèves du prof depuis la BD
const chargerAbsencesProf = async () => {
    const prof = await getTeacherReel();

    const reponse = await fetch(`${API}/api/absences/teacher/${prof.id}`, {
        headers: { "Authorization": "Bearer " + token }
    });

    const absences = await reponse.json();
    tousLesAbsencesProf = absences;
    afficherLignesAbsencesProf(tousLesAbsencesProf);
};

// Injecte les lignes du tableau des absences
const afficherLignesAbsencesProf = (liste) => {
    const tbody = document.getElementById("listeAbsencesProf");
    tbody.innerHTML = "";

    liste.forEach(function (absence) {
        const ligne = document.createElement("tr");
        ligne.innerHTML = `
            <td>${absence.student_id}</td>
            <td>${absence.nom || ""} ${absence.prenom || ""}</td>
            <td>${absence.classe || ""}</td>
            <td>${absence.date}</td>
            <td><span class="badge ${absence.status === 'justifiee' ? 'justifie' : 'non_justifie'}">${absence.status === 'justifiee' ? 'Justifié' : 'Non justifié'}</span></td>
            <td>
                <div class="actions_ligne">
                    <button class="btn_action modifier"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn_action supprimer"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;

        const btnModif = ligne.querySelector(".modifier");
        const btnSprim = ligne.querySelector(".supprimer");

        // Supprime l'absence et recharge la liste
        btnSprim.addEventListener("click", async () => {
            await fetch(`${API}/api/absences/${absence.id}`, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token }
            });
            chargerAbsencesProf();
        });

        // Ouvre la modale de modification pré-remplie
        btnModif.addEventListener("click", () => {
            document.getElementById("modifEtudiantAbsenceProf").value = `${absence.prenom} ${absence.nom}`;
            document.getElementById("modifDateAbsenceProf").value = absence.date;

            const btnJ = document.getElementById("modifBtnJustifieProf");
            const btnNJ = document.getElementById("modifBtnNonJustifieProf");
            btnJ.classList.remove("active");
            btnNJ.classList.remove("active");
            if (absence.status === "justifiee") {
                btnJ.classList.add("active");
            } else {
                btnNJ.classList.add("active");
            }

            const overlay = document.querySelector(".formulaireCacherAbsenceProf");
            overlay.dataset.absenceId = absence.id;
            overlay.style.display = "flex";
        });

        tbody.append(ligne);
    });
};


// MODALE MODIFICATION ABSENCE 

// Statut sélectionné dans la modale de modification
let statutModifAbsenceProf = "non_justifiee";

// Récupération des éléments de la modale absence
const AnnulerAbsenceProf = document.getElementById("AnnulerAbsenceProf");
const modifSauvAbsenceProf = document.getElementById("modifSauvAbsenceProf");
const btnFermAbsenceProf = document.querySelector(".btn_fermAbsenceProf");
const modifBtnJustifieProf = document.getElementById("modifBtnJustifieProf");
const modifBtnNonJustifieProf = document.getElementById("modifBtnNonJustifieProf");

// Bascule le statut dans la modale vers justifié
modifBtnJustifieProf.addEventListener("click", function () {
    statutModifAbsenceProf = "justifiee";
    this.classList.add("active");
    modifBtnNonJustifieProf.classList.remove("active");
});

// Bascule le statut dans la modale vers non justifié
modifBtnNonJustifieProf.addEventListener("click", function () {
    statutModifAbsenceProf = "non_justifiee";
    this.classList.add("active");
    modifBtnJustifieProf.classList.remove("active");
});

// Ferme la modale sans sauvegarder
AnnulerAbsenceProf.addEventListener("click", () => {
    document.querySelector(".formulaireCacherAbsenceProf").style.display = "none";
});

// Ferme via le bouton X
btnFermAbsenceProf.addEventListener("click", () => {
    document.querySelector(".formulaireCacherAbsenceProf").style.display = "none";
});

// Ferme en cliquant sur le fond sombre
document.querySelector(".formulaireCacherAbsenceProf").addEventListener("click", (e) => {
    if (e.target.classList.contains("formulaireCacherAbsenceProf")) {
        document.querySelector(".formulaireCacherAbsenceProf").style.display = "none";
    }
});

// Sauvegarde la modification de l'absence
modifSauvAbsenceProf.addEventListener("click", async () => {
    const id = document.querySelector(".formulaireCacherAbsenceProf").dataset.absenceId;
    const date = document.getElementById("modifDateAbsenceProf").value;
    const status = statutModifAbsenceProf;

    const reponse = await fetch(`${API}/api/absences/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ date, status })
    });

    if (!reponse.ok) { alert("Erreur modification absence"); return; }

    alert("Absence modifiée !");
    document.querySelector(".formulaireCacherAbsenceProf").style.display = "none";
    chargerAbsencesProf();
});


//  FORMULAIRE AJOUT ABSENCE 

// Récupération des éléments du formulaire d'ajout absence
const classeAbsenceProf = document.getElementById("classeAbsenceProf");
const etudiantAbsenceProf = document.getElementById("etudiantAbsenceProf");
const absenceDateProf = document.getElementById("absenceDateProf");
const btn_enregistreAbsenceProf = document.getElementById("btn_enregistreAbsenceProf");
const btn_annulAbsenceProf = document.querySelector(".btn_annulAbsenceProf");
const btn_justifie = document.getElementById("btn_justifie");
const btn_non_justifie = document.getElementById("btn_non_justifie");

// Charge les classes depuis la BD dans le select classe
const chargerClassesAbsenceProf = async () => {
    const reponse = await fetch(`${API}/api/students`, {
        headers: { "Authorization": "Bearer " + token }
    });
    const students = await reponse.json();
    const classes = [...new Set(students.map(s => s.classe))];

    classeAbsenceProf.innerHTML = '<option value="">Sélectionnez une classe</option>';
    classes.forEach(function (classe) {
        const option = document.createElement("option");
        option.value = classe;
        option.textContent = classe;
        classeAbsenceProf.appendChild(option);
    });
};

// Au changement de classe — charge les étudiants correspondants
classeAbsenceProf.addEventListener("change", async function () {
    const classe = this.value;
    etudiantAbsenceProf.innerHTML = '<option value="">Sélectionnez un étudiant</option>';
    if (!classe) return;

    const reponse = await fetch(`${API}/api/students`, {
        headers: { "Authorization": "Bearer " + token }
    });
    const students = await reponse.json();
    students.filter(s => s.classe === classe).forEach(function (student) {
        const option = document.createElement("option");
        option.value = student.id;
        option.textContent = `${student.prenom} ${student.nom}`;
        etudiantAbsenceProf.appendChild(option);
    });
});

// Statut sélectionné dans le formulaire d'ajout
let statutAbsenceProf = "non_justifiee";

// Bascule le statut vers justifié
btn_justifie.addEventListener("click", function () {
    statutAbsenceProf = "justifiee";
    changerStatutProf("justifie");
});

// Bascule le statut vers non justifié
btn_non_justifie.addEventListener("click", function () {
    statutAbsenceProf = "non_justifiee";
    changerStatutProf("non_justifie");
});

// Enregistre une nouvelle absence pour un étudiant
btn_enregistreAbsenceProf.addEventListener("click", async function () {
    const student_id = etudiantAbsenceProf.value;
    const date = absenceDateProf.value;
    const status = statutAbsenceProf;

    if (!student_id || !date) return alert("Veuillez sélectionner un étudiant et une date");

    const reponse = await fetch(`${API}/api/absences`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ student_id: Number(student_id), date, status })
    });

    if (!reponse.ok) { alert("Erreur ajout absence"); return; }

    alert("Absence ajoutée !");
    etudiantAbsenceProf.value = "";
    absenceDateProf.value = "";
    statutAbsenceProf = "non_justifiee";
    changerStatutProf("non_justifie");
    chargerAbsencesProf();
});

// Vide le formulaire d'ajout absence
btn_annulAbsenceProf.addEventListener("click", function () {
    etudiantAbsenceProf.value = "";
    absenceDateProf.value = "";
    statutAbsenceProf = "non_justifiee";
    changerStatutProf("non_justifie");
});


//  PROFIL

// Charge et affiche les informations du profil du professeur connecté
const chargerProfilProf = async () => {
    const prof = await getTeacherReel();

    document.querySelector(".nom_profil").textContent = prof.nom;
    document.querySelector(".sous_texte_profil").textContent = `Professeur - ${prof.matiere || "Non assigné"}`;
    document.querySelector(".avatar_grand").textContent = prof.nom.substring(0, 2).toUpperCase();

    const infos = document.querySelectorAll(".valeur_info");
    if (infos[0]) infos[0].textContent = prof.nom;
    if (infos[1]) infos[1].textContent = prof.matiere || "Non assigné";
};


//  LANCEMENT 

chargerClassesNoteProf();
chargerClassesAbsenceProf();
chargerNotesProf();
chargerAbsencesProf();
chargerProfilProf();




//DECONNEXION
document.querySelector(".logout").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../dossierhtml/index.html";
});