# Système de Gestion Scolaire
Gérez votre école complètement depuis le terminal.

---

## 📖 Présentation du projet

Ce projet est une application **CLI (ligne de commande)** de gestion complète d'un système scolaire, développée en **Node.js** avec **SQLite** comme base de données. Elle permet de gérer les utilisateurs, les étudiants, les professeurs, les matières, les notes, les absences et les statistiques — le tout en mode terminal, sans aucun frontend.

---

## Problématique

Dans de nombreux établissements scolaires, la gestion des données reste manuelle ou dispersée sur plusieurs outils :

- absence d'un système centralisé pour gérer étudiants, professeurs et matières,
- difficulté à suivre les notes et calculer les moyennes de manière fiable,
- aucune traçabilité des absences justifiées ou non justifiées,
- pas de contrôle d'accès selon les rôles (admin, professeur, étudiant),
- absence de journalisation des actions effectuées dans le système.

---

## Solution proposée

Une application terminal structurée en modules, sécurisée par rôle, avec une base de données relationnelle SQLite, un système de logs automatique et une génération automatique des mots de passe.

---

## Fonctionnalités principales

### 👤 Gestion des utilisateurs
Le système gère trois types de rôles distincts :
- création d'un compte avec un **username unique** et un **mot de passe généré automatiquement**,
- connexion sécurisée par **username + mot de passe** pour les admins et professeurs,
- connexion par **matricule + mot de passe** pour les étudiants,
- modification et suppression avec cascade sur les tables liées.

### 🎓 Gestion des étudiants
- ajout d'un étudiant avec matricule, nom, prénom, âge et classe,
- création automatique d'un compte utilisateur lié (`user_id`),
- modification et suppression complète (notes et absences incluses),
- recherche par ID ou par matricule.

### 👨‍🏫 Gestion des professeurs
- ajout d'un professeur avec son nom et sa matière assignée,
- création automatique d'un compte utilisateur lié (`user_id`),
- le professeur ne voit et n'agit que sur **sa propre matière**,
- suppression propre avec désaffectation automatique de la matière.

### 📚 Gestion des matières
- ajout d'une matière et affectation d'un professeur,
- liste complète des matières avec le nom du professeur associé,
- modification et suppression sécurisées.

### 📝 Gestion des notes
- ajout d'une note (entre 0 et 20, vérifiée par contrainte SQL),
- modification et suppression par ID,
- calcul de la moyenne d'un étudiant dans une matière,
- affichage des notes sous forme de tableau.

### 📅 Gestion des absences
- enregistrement d'une absence avec date et heure automatiques,
- statut **Justifié** ou **Non justifié**,
- consultation et comptage des absences par étudiant.

### 📊 Statistiques
- moyenne d'un étudiant par matière,
- moyenne générale d'un étudiant (toutes matières),
- moyenne générale de toute l'école,
- meilleur étudiant par matière et toutes matières confondues,
- nombre total d'utilisateurs, étudiants et professeurs.

### 🔐 Système d'authentification
- **Admin / Professeur** : connexion par `username` + `mot de passe`,
- **Étudiant** : connexion par `matricule` + `mot de passe`,
- vérification du rôle à chaque connexion,
- `user_id` lié directement dans les tables `students` et `teachers` pour une authentification fiable.

### 📋 Journalisation (Logs)
Toutes les actions importantes sont enregistrées dans `logs/app.log` :
```
2026-06-13 10:15:00 [INFO] Alice Martin a ajouté l'étudiant Jean Dupont
2026-06-13 10:20:00 [WARNING] Tentative de connexion échouée — username: prof_x
2026-06-13 10:30:00 [INFO] M. Grand (professeur) connecté
```

---

## Structure du projet

```
school-management/
│── main.js
│── seed.js
│── db/
│   ├── database.js
│   └── tables.js
│── models/
│   ├── modelsUser.js
│   ├── modelsStudent.js
│   ├── modelsTeacher.js
│   ├── modelsSubject.js
│   ├── modelsGrade.js
│   └── modelsAbsence.js
│── services/
│   ├── servicesUsers.js
│   ├── servicesStudents.js
│   ├── servicesTeachers.js
│   ├── servicesSubjects.js
│   ├── servicesGrades.js
│   ├── servicesAbsences.js
│   └── servicesStatistiques.js
│── config/
│   ├── menu_systeme.js
│   ├── menu.js
│   └── authantification.js
│── utils/
│   ├── logger.js
│   └── password.js
│── logs/
│   └── app.log
```

---

## Base de données SQLite

Le projet utilise **6 tables relationnelles** :

| Table | Description |
|---|---|
| `users` | Tous les comptes de connexion (admin, professeur, étudiant) |
| `students` | Fiches des étudiants, liées à `users` via `user_id` |
| `teachers` | Fiches des professeurs, liées à `users` via `user_id` |
| `subjects` | Matières avec affectation d'un professeur |
| `grades` | Notes des étudiants par matière (0-20) |
| `absences` | Absences des étudiants avec date et statut |

---

## Menus disponibles

### Menu Admin
```
1. Gérer les utilisateurs
2. Gérer les étudiants
3. Gérer les professeurs
4. Gérer les matières
5. Gérer les notes
6. Gérer les absences
7. Statistiques
```

### Menu Professeur
```
1. Ajouter une note
2. Modifier une note
3. Enregistrer une absence
4. Voir les étudiants
```

### Menu Étudiant
```
1. Voir mes notes
2. Voir ma moyenne
3. Voir mes matières
4. Voir mes absences
```

---

## Technologies utilisées

- **Node.js** — runtime JavaScript
- **better-sqlite3** — base de données SQLite synchrone
- **crypto** (module natif Node.js) — génération de mots de passe
- **readline** (module natif Node.js) — interface terminal interactive
- **fs / path** (modules natifs Node.js) — gestion des logs

---

## Installation et lancement

```bash
# Cloner le projet
git clone https://github.com/votre-username/school-management.git
cd school-management

# Installer les dépendances
npm install

# Peupler la base avec des données de test
node seed.js

# Lancer l'application
node main.js
```

> ⚠️ Si vous changez de système d'exploitation (Windows ↔ Linux ↔ Mac), relancez `npm install` pour recompiler le module natif `better-sqlite3`.

---

## Contraintes respectées

- ✅ Aucun framework
- ✅ Aucun frontend (HTML/CSS interdit)
- ✅ Application en ligne de commande uniquement
- ✅ Utilisation obligatoire de SQLite
- ✅ Système de logs obligatoire
- ✅ Code structuré en modules
- ✅ Utilisation de Git

---

## Auteur

Projet conçu et développé par **N'GORAN ATCHIELOH SALOMON REGIS** dans le cadre d'une formation en développement d'applications — Côte d'Ivoire.
