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
coverImage: https://res.cloudinary.com/noezectz/image/upload/v1653050141/SatNaing/blog_at_cafe_ei1wf4.jpg
coverImageAlt: Macbook at a cafe
title: Comment j'ai auto-hébergé mon portfolio
description:
  Mon retour d'expérience sur le développement et l'hébergement automatisé de mon portfolio,
  en utilisant Next.js, TailwindCSS et MicroK8s.
excerpt:
  Mon parcours de réflexion, de conception et de développement pour créer mon portfolio et
  l'automatiser avec des pipelines CI/CD et Kubernetes. Retour sur les défis rencontrés et
  les choix techniques effectués.
slug: automatisation-deploiement-portfolio
featured: true
category: DevOps & Développement
language: French
---

Dans une volonté de m'orienter vers le DevOps, j'ai décidé d'automatiser le déploiement de mon site.
Tout d'abord, ce projet reposera sur un modèle GitOps, c'est à dire que ce qui sera présent sur le repo git, ici sur Github, servira de source de vérité.

## Objectifs

Le but de ce projet étant tout d'abord d'obtenir un MVP (Minimum Viable Product), en suivant une logique de méthode agile, j'ai d'abord décidé de limiter le projet à ce qui suit :

1. Un cluster Kubernetes à l'aide de MicroK8s
2. Un déploiement de mon portfolio sous forme d'un conteneur Docker
3. Une exposition via un nom de domaine personnalisé
4. Des pipelines CI/CD pour automatiser les mises à jour du site web et des configurations du cluster
5. Un monitoring permettant de surveiller la santé du cluster

### Pourquoi MicroK8s

MicroK8s a été choisi pour sa simplicité d'installation et configuration, parfaite dans le cadre d'un MVP.
D'autres options pourront être explorées lors de l'évolution de ce projet.

### Choix du VPS

Le VPS (Virtual Private Server) a été choisi par défaut, j'en possédais déjà un sur pulseheberg, voici sa configuration :

- Processeur : Intel Xeon E5-2680v4
- RAM : 8GB DDR4
- Stockage : 1TB en RAID 10
- Connexion : 750 Mbps
- OS : Ubuntu 22.04 LTS

Ce qui est largement au dessus des minimum requis par le logiciel.

> MicroK8s runs in as little as 540MB of memory, but to accommodate workloads, we recommend a system with at least 20G of disk space and 4G of memory.
> _official doc_

## Création de l'image Docker

Pour automatiser ce segment, nous allons faire en sorte que chaque nouveau commit sur la branche principale du repo Github de l'appli construise une nouvelle image, et la pousse sur le registry Docker Hub, sous le tag latest.

Pour ce faire, je vais créer une pipeline. Sur Github, les pipelines fonctionnent à l'aide de Github Actions.
Pour avoir notre pipeline fonctionnelle, il faut créer un fichier yaml sous le dossier .github/workflows .
Je vais ensuite créer le repository de l'image sur Docker Hub avec mon compte.

Puis je crée un fichier deploy.yml au sein du dossier workflows avec ceci :

```
name: Deploy Website

on:
  push:
    branches:
      - main

env:
  NAMESPACE: default
  DEPLOYMENT_NAME: portfolio

jobs:
  build_push_image:
    name: Build & Push Docker Image
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Log in to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: woulf/portfolio:latest
```

Avec ça, mon image est correctement construite et publiée à chaque nouveau commit sur la branche main
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6s9kch8i2m1yfseue0dm.png)

### Nom de domaine personnalisé

Avoir un nom de domaine me permettra de partager de plus joli lien que de laides adresses IP.
Ici aussi, je vais me servir de ce que je possède déjà.
Avec PulseHeberg, je loue annuellement le nom de domaine woulf.fr pour 8€/an.
Je vais donc exposer mon portfolio via ceci.

## Installation et configuration de MicroK8s

Pour installer simplement MicroK8s sur mon VPS, je vais me servir du packet manager snap :
`sudo snap install microk8s --classic`

Pour ne pas à avoir à taper sudo pour chaque commande :
`sudo usermod -a -G microk8s $USER`
`newgrp microk8s`

Je vérifie que MicroK8s soit bien installé :
`microk8s status --wait-ready`

Activation des modules suivants :
`microk8s enable dns ingress storage`

- DNS : pour la résolution de noms dans le cluster.
- Ingress : pour gérer les accès HTTP/HTTPS.
- Storage : pour la gestion des volumes persistants.

Vérification que les services soient bien actifs
`microk8s kubectl get all -A`

Pour utiliser kubectl depuis mon utilisateur normal, j'exporte la config :
`microk8s config > ~/.kube/config`

### Configuration du pare-feu

```
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80,443/tcp # HTTP/HTTPS
sudo ufw allow 16443/tcp  # Kubernetes API
```

Puis on l'active
`sudo ufw enable`

## Project Links

- Website: [http://woulf.fr/](http://woulf.fr/ "http://woulf.fr/")
- Blog: [http://woulf.fr/blog](http://woulf.fr/blog "http://woulf.fr/blog")
- Repo: [https://github.com/Wooulf/forkfolio](https://github.com/Wooulf/forkfolio "https://github.com/Wooulf/forkfolio")
