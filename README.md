# Système de Gestion Scolaire

Application web complète de gestion scolaire, avec back-end API et front-end intégré.

## 📖 Présentation du projet

Ce projet est une application web de gestion complète d'un système scolaire, développée en Node.js avec Express.js pour le back-end et une base de données SQLite hébergée sur Turso (libSQL). Le front-end est construit en HTML/CSS/JavaScript, sans framework. Elle permet de gérer les utilisateurs, les étudiants, les professeurs, les matières, les notes, les absences et les statistiques via des interfaces web dédiées à chaque rôle.

Le projet a démarré comme une application en ligne de commande (CLI), puis a évolué vers une application web complète avec authentification par token, API REST, et tableaux de bord interactifs pour chaque type d'utilisateur.

## Problématique

Dans de nombreux établissements scolaires, la gestion des données reste manuelle ou dispersée sur plusieurs outils :

- absence d'un système centralisé pour gérer étudiants, professeurs et matières,
- difficulté à suivre les notes et calculer les moyennes de manière fiable,
- aucune traçabilité des absences justifiées ou non justifiées,
- pas de contrôle d'accès selon les rôles (admin, professeur, étudiant),
- absence d'une interface accessible depuis n'importe quel navigateur.

## Solution proposée

Une application web structurée en API REST sécurisée par rôle, avec une base de données relationnelle hébergée dans le cloud (Turso), une authentification par JWT, et trois tableaux de bord distincts (admin, professeur, étudiant) accessibles depuis un navigateur.

## Fonctionnalités principales

### 👤 Gestion des utilisateurs
- création d'un compte avec un username unique et un mot de passe (haché via bcrypt),
- connexion sécurisée par username + mot de passe pour les admins et professeurs,
- connexion par matricule + mot de passe pour les étudiants,
- authentification par token JWT sur toutes les routes protégées,
- modification et suppression avec cascade sur les tables liées.

### 🎓 Gestion des étudiants
- ajout d'un étudiant avec matricule, nom, prénom, âge et classe,
- création automatique d'un compte utilisateur lié (user_id),
- modification et suppression complète (notes et absences incluses),
- recherche par ID ou par matricule,
- tableau de bord dédié : consultation des notes, absences et profil.

### 👨‍🏫 Gestion des professeurs
- ajout d'un professeur avec son nom et sa matière assignée,
- création automatique d'un compte utilisateur lié (user_id),
- assignation de classes spécifiques à chaque professeur (accès limité),
- le professeur ne voit et n'agit que sur les étudiants de ses classes assignées,
- tableau de bord dédié : ajout de notes, gestion des absences, consultation du profil,
- suppression propre avec désaffectation automatique de la matière.

### 📚 Gestion des matières
- ajout d'une matière et affectation d'un professeur,
- liste complète des matières avec le nom du professeur associé,
- modification et suppression sécurisées.

### 📝 Gestion des notes
- ajout d'une note (entre 0 et 20, vérifiée par contrainte SQL),
- modification et suppression par ID,
- calcul de la moyenne d'un étudiant par matière ou toutes matières confondues,
- affichage des notes sous forme de tableau dans l'interface web.

### 📅 Gestion des absences
- enregistrement d'une absence avec date et statut (justifiée / non justifiée),
- consultation et comptage des absences par étudiant,
- filtrage des absences par professeur selon ses classes assignées.

### 📊 Statistiques
- moyenne d'un étudiant par matière,
- moyenne générale d'un étudiant (toutes matières),
- moyenne générale de toute l'école,
- meilleur étudiant par matière et toutes matières confondues,
- nombre total d'utilisateurs, étudiants et professeurs,
- statistiques détaillées (notes, absences, matières) affichées sur les tableaux de bord.

### 🔐 Système d'authentification
- Admin / Professeur : connexion par username + mot de passe,
- Étudiant : connexion par matricule + mot de passe,
- génération d'un token JWT à la connexion, vérifié à chaque requête API,
- vérification du rôle à chaque connexion et sur chaque route protégée,
- user_id lié directement dans les tables students et teachers pour une authentification fiable.

## Structure du projet

```
school-management/
│── main.js                    # Point d'entrée du serveur Express
│── seeds.js                   # Peuplement de la base avec des données de test
│── db/
│   └── database.js            # Connexion à la base Turso
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
│   ├── serviceTeachers_classes.js
│   └── servicesStatistiques.js
│── controleur/
│   ├── controleUsers.js
│   ├── controleStudents.js
│   ├── controleTeachers.js
│   ├── controleSubjects.js
│   ├── controleGrades.js
│   ├── controleAbsences.js
│   ├── controleAuthantification.js
│   ├── controleTeachers_classes.js
│   └── controleStatistique.js
│── routes/
│   ├── routesUsers.js
│   ├── routesStudents.js
│   ├── routesTeachers.js
│   ├── routesSubjects.js
│   ├── routesGrades.js
│   ├── routesAbsences.js
│   ├── routesAuthantification.js
│   ├── routesTeacher_classses.js
│   └── routesStatistique.js
│── middleweaes/
│   ├── middleAuth.js           # Vérification du token JWT
│   └── middleRoles.js          # Vérification des rôles autorisés
│── public/
│   ├── dossierhtml/            # Pages HTML (index, admin, teachers, students)
│   ├── dossierCss/             # Feuilles de style
│   └── dossierJS/              # Scripts front-end par page
```

## Base de données

Le projet utilise 7 tables relationnelles, hébergées sur Turso (base SQLite distribuée dans le cloud) :

| Table | Description |
|---|---|
| `users` | Tous les comptes de connexion (admin, professeur, étudiant) |
| `students` | Fiches des étudiants, liées à `users` via `user_id` |
| `teachers` | Fiches des professeurs, liées à `users` via `user_id` |
| `teacher_classes` | Classes assignées à chaque professeur |
| `subjects` | Matières avec affectation d'un professeur |
| `grades` | Notes des étudiants par matière (0-20) |
| `absences` | Absences des étudiants avec date et statut |

## Interfaces disponibles

### Interface Admin
- Gestion complète des utilisateurs, étudiants, professeurs et matières
- Statistiques globales de l'établissement
- Assignation des classes aux professeurs

### Interface Professeur
- Ajout et modification des notes des étudiants de ses classes
- Enregistrement et gestion des absences
- Consultation de son profil et de sa matière assignée

### Interface Étudiant
- Consultation de ses notes par matière
- Consultation de l'historique de ses absences
- Consultation de son profil

## Technologies utilisées

- **Node.js** — runtime JavaScript
- **Express.js** — framework back-end pour l'API REST
- **Turso (@libsql/client)** — base de données SQLite hébergée dans le cloud
- **bcrypt** — hachage des mots de passe
- **jsonwebtoken** — authentification par token JWT
- **HTML / CSS / JavaScript** — front-end, sans framework
- **dotenv** — gestion des variables d'environnement

## Installation et lancement

```bash
# Cloner le projet
git clone https://github.com/votre-username/school-management2.git
cd school-management2

# Installer les dépendances
npm install

# Configurer les variables d'environnement dans un fichier .env
TURSO_DATABASE_URL=libsql://votre-db.turso.io
TURSO_AUTH_TOKEN=votre_token
JWT_SECRET=votre_secret

# Peupler la base avec des données de test
node seeds.js

# Lancer le serveur
node main.js
```

L'application est ensuite accessible sur `http://localhost:3000`.

## Déploiement

Le projet est déployé sur [Render](https://render.com), avec la base de données hébergée sur [Turso](https://turso.tech).

## Contraintes respectées

- ✅ Architecture back-end / front-end séparée
- ✅ API REST sécurisée par rôle
- ✅ Base de données relationnelle (SQLite / Turso)
- ✅ Authentification par token JWT
- ✅ Code structuré en modules (MVC : models, services, controleurs, routes)
- ✅ Utilisation de Git

## Auteur

Projet conçu et développé par N'GORAN ATCHIELOH SALOMON REGIS dans le cadre d'une formation en développement d'applications — Côte d'Ivoire.
