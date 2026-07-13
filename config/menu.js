// LES DIFFERENT TYPES DE MENU DE MON PROGRAMME



// Choix de connexion ou de sortie

const menuPrincipal = `

=== SYSTÈME SCOLAIRE ===

1. Connexion
0. Quitter

========================
Votre choix : `;



// Le menu des choix de role

const menuRole = `

=== CHOISIR UN RÔLE ===

1. Admin
2. Professeur
3. Étudiant
0. Retour

=======================
Votre choix : `;



// LE MENU DE L'ADMINISTRATEUR ET LES DIEFFERENTES OPTION LIEE AUX SERVICES

const menuAdmin = `

=== MENU ADMIN ===

1. Gérer les utilisateurs
2. Gérer les étudiants
3. Gérer les professeurs
4. Gérer les matières
5. Gérer les notes
6. Gérer les absences
7. Statistiques
0. Déconnexion

==================
Votre choix : `;



// LE MENU DU PROF ET LES ACCES QUI LUI SON ACCORD2 VIS A VIS DES ETUDIANTS

const menuProfesseur = `

=== MENU PROFESSEUR ===

1. Ajouter une note
2. Modifier une note
3. Enregistrer une absence
4. Voir les étudiants
0. Déconnexion

=======================
Votre choix : `;



// LE MENU ETUDIANT ET SES ACTION DE CONSULTATION

const menuEtudiant = `

=== MENU ÉTUDIANT ===

1. Voir mes notes
2. Voir ma moyenne
3. Voir mes matières
4. Voir mes absences
0. Déconnexion

=====================
Votre choix : `;

export { menuPrincipal, menuRole, menuAdmin, menuProfesseur, menuEtudiant };