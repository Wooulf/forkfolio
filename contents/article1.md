---
coverImageWidth: "1200"
coverImageHeight: "700"
datetime: 2025-03-10T14:37:30Z
tags:
  - MicroK8s
  - NextJS
  - Tailwind CSS
  - Blog
author: Woulf
type: article
coverImage: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9kg8r33qvkcp35bxmc93.jpg
coverImageAlt: GitOps logo
title: Article 1 - Mise en place d’un déploiement GitOps minimaliste
excerpt:
  Une introduction à mon approche GitOps pour auto-héberger mon portfolio, avec séparation du code et de l'infra, déploiement Kubernetes, et CI/CD automatisée.
slug: automatisation-deploiement-portfolio1
featured: true
category: DevOps & Développement
language: French
---

## Contexte du projet

Dans le cadre de mon orientation vers le **DevOps**, j’ai décidé d’automatiser le déploiement de mon site web personnel.

Le projet repose sur un modèle **GitOps** : autrement dit, c’est le dépôt Git (hébergé sur GitHub) qui fait office de **source de vérité**. Toute modification validée dans le dépôt doit pouvoir se refléter automatiquement sur l’environnement de production.

---

## Organisation des dépôts

Pour respecter cette logique GitOps, j’ai fait le choix de **séparer le code de l’application** et **la configuration de l’infrastructure** dans deux dépôts Git distincts :

- Un **dépôt applicatif** : [`Wooulf/forkfolio`](https://github.com/Wooulf/forkfolio), qui contient le code source du site (Next.js), le `Dockerfile`, et une pipeline CI pour builder et déployer l’image Docker.
- Un **dépôt infrastructure** : [`Wooulf/infra-k8s-terraform`](https://github.com/Wooulf/infra-k8s-terraform), qui contient tous les fichiers de configuration Kubernetes (`deployment.yaml`, `service.yaml`, `ingress.yaml`, etc.), avec une autre pipeline qui applique automatiquement les modifications sur le cluster.

🔁 Cette séparation permet une meilleure maintenabilité, une clarté dans la gestion des responsabilités, et respecte les bonnes pratiques GitOps.

---

## Objectifs du projet

L’idée est d’obtenir un **MVP (Minimum Viable Product)** dans une logique agile, en me concentrant d’abord sur les fonctionnalités essentielles :

1. Un cluster Kubernetes minimaliste via **MicroK8s**
2. Le déploiement de mon portfolio sous forme de **conteneur Docker**
3. Une exposition publique via un **nom de domaine personnalisé**
4. Une **pipeline CI/CD** pour automatiser les mises à jour
5. Un **monitoring basique** pour observer la santé du cluster

---

## Pourquoi MicroK8s ?

J’ai choisi **MicroK8s** pour sa simplicité d’installation et sa légèreté.  
C’est une solution idéale pour un environnement de test, un POC ou un projet personnel comme celui-ci.

D’autres alternatives comme **K3s**, **kind** ou **minikube** pourront être envisagées plus tard selon l’évolution du projet.

---

## L’environnement utilisé

Je dispose d’un **VPS** déjà en place chez **PulseHeberg**, avec la configuration suivante :

- **Processeur** : Intel Xeon E5-2680v4  
- **RAM** : 8 Go DDR4  
- **Stockage** : 1 To en RAID 10  
- **Connexion** : 750 Mbps  
- **Système** : Ubuntu 22.04 LTS

Ce VPS dépasse largement les prérequis de MicroK8s :

> _“MicroK8s runs in as little as 540MB of memory, but to accommodate workloads, we recommend a system with at least 20G of disk space and 4G of memory.”_  
> — *Documentation officielle*

---

## Et la suite ?

Dans le prochain article, je présenterai la configuration initiale du cluster MicroK8s sur ce VPS, en incluant :
- L’installation de MicroK8s
- L’activation des modules nécessaires (DNS, ingress…)
- La configuration du pare-feu

🔧 L’idée est de construire les fondations techniques sur lesquelles l’ensemble du projet reposera.