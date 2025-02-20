# Documentation Détaillée de l'Application

## Introduction

Cette application est un système de gestion d'apprentissage conçu pour faciliter l'interaction entre les enseignants et les étudiants. Elle permet la gestion des cours, des inscriptions, des évaluations et le suivi des progrès des étudiants. Cette documentation décrit en détail chaque fonctionnalité, son fonctionnement et les technologies utilisées.

## Fonctionnalités

### 1. Inscription et Authentification

#### Description

Les utilisateurs peuvent s'inscrire en tant qu'étudiants ou enseignants. L'application utilise NextAuth pour gérer l'authentification.

#### Fonctionnement

-   **Inscription** :

    -   Les utilisateurs remplissent un formulaire d'inscription avec leur nom, email, mot de passe et rôle (étudiant ou enseignant).
    -   Les données sont validées à l'aide de Zod pour s'assurer qu'elles respectent les critères requis.
    -   Le mot de passe est haché avec bcrypt avant d'être stocké dans la base de données.
    -   Si l'email est déjà utilisé, un message d'erreur est retourné.

-   **Connexion** :
    -   Les utilisateurs saisissent leur email et mot de passe.
    -   Les informations sont validées et comparées avec celles stockées dans la base de données.
    -   Si les informations sont correctes, l'utilisateur est connecté et redirigé vers son tableau de bord.

### 2. Gestion des Cours

#### Description

Les enseignants peuvent créer, mettre à jour et supprimer des cours. Les étudiants peuvent s'inscrire à ces cours.

#### Fonctionnement

-   **Création de Cours** :

    -   Les enseignants remplissent un formulaire avec les détails du cours (titre, description, instrument, niveau, etc.).
    -   Les données sont validées et enregistrées dans la base de données.

-   **Mise à Jour de Cours** :

    -   Les enseignants peuvent modifier les informations d'un cours existant.
    -   Les modifications sont validées et mises à jour dans la base de données.

-   **Suppression de Cours** :

    -   Les enseignants peuvent supprimer un cours. L'application vérifie d'abord si le cours a des inscriptions actives avant de le supprimer.

-   **Inscription aux Cours** :
    -   Les étudiants peuvent parcourir les cours disponibles et s'inscrire à ceux qui les intéressent.
    -   Lorsqu'un étudiant s'inscrit, une entrée est créée dans la table `Enrollment` pour suivre son statut.

### 3. Suivi des Étudiants

#### Description

Les enseignants peuvent suivre les progrès des étudiants dans leurs cours et ajouter des évaluations.

#### Fonctionnement

-   **Suivi des Progrès** :

    -   Les enseignants peuvent consulter la liste des étudiants inscrits à leurs cours.
    -   Pour chaque étudiant, ils peuvent voir les évaluations et les commentaires associés.

-   **Ajout d'Évaluations** :
    -   Les enseignants peuvent ajouter des évaluations pour chaque étudiant dans un cours spécifique.
    -   Les évaluations sont stockées dans la table `Progress`, qui contient des informations sur la date, l'évaluation et les commentaires.

### 4. Tableaux de Bord

#### Description

Des tableaux de bord distincts sont fournis pour les enseignants et les étudiants, affichant des informations pertinentes.

#### Fonctionnement

-   **Tableau de Bord de l'Enseignant** :

    -   Affiche les cours que l'enseignant enseigne, les étudiants inscrits et les évaluations à ajouter.
    -   Permet d'accéder rapidement aux fonctionnalités de gestion des cours.

-   **Tableau de Bord de l'Étudiant** :
    -   Affiche les cours auxquels l'étudiant est inscrit, les évaluations reçues et les cours disponibles.
    -   Permet aux étudiants de gérer leurs inscriptions et de suivre leurs progrès.

### 5. Notifications

#### Description

L'application envoie des notifications pour informer les utilisateurs des mises à jour ou des erreurs.

#### Fonctionnement

-   Les notifications sont affichées en cas d'erreurs lors de l'inscription, de la connexion, de la création de cours ou d'autres actions.
-   Les messages de succès sont également affichés pour confirmer les actions réussies, comme l'inscription à un cours ou la création d'un compte.

## Technologies Utilisées

-   **Frontend** :

    -   **Next.js** : Framework pour le rendu côté serveur et la gestion des routes.
    -   **React** : Bibliothèque pour construire l'interface utilisateur.
    -   **Tailwind CSS** : Utilisé pour le style et la mise en page.

-   **Backend** :

    -   **Node.js** : Environnement d'exécution pour le serveur.
    -   **Prisma** : ORM pour interagir avec la base de données.

-   **Base de Données** :
    -   **PostgreSQL** : Système de gestion de base de données relationnelle utilisé pour stocker les données des utilisateurs, des cours, des inscriptions et des évaluations.

## Conclusion

Cette application de gestion d'apprentissage offre une plateforme intuitive pour les enseignants et les étudiants, facilitant la gestion des cours et le suivi des progrès. Grâce à l'utilisation de technologies modernes et d'une architecture bien pensée, elle fournit une expérience utilisateur fluide et efficace. Les fonctionnalités sont conçues pour répondre aux besoins des utilisateurs tout en garantissant la sécurité et la fiabilité des données.
