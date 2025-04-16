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
coverImage: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zqyabboavyg5gtxq1plz.jpg
coverImageAlt: MicroK8s logo
title: Article 2 - Installation et configuration de MicroK8s
excerpt:
  Mise en place de mon cluster Kubernetes local avec MicroK8s - installation, configuration réseau, activation des modules clés, et ouverture sécurisée via UFW.
slug: automatisation-deploiement-portfolio2
featured: false
category: DevOps & Développement
language: French
---

Maintenant que le projet est posé, il est temps de mettre en place l’infrastructure Kubernetes sur mon VPS avec MicroK8s.  
Ce sera la base technique sur laquelle je déploierai ensuite mon portfolio.

---

## Étape 1 — Installation de MicroK8s

Je commence par installer MicroK8s à l’aide du gestionnaire de paquets `snap` (déjà présent sur Ubuntu) :

```
sudo snap install microk8s --classic
```

---

## Étape 2 — Ajout de mon utilisateur

Par défaut, toutes les commandes `microk8s` nécessitent `sudo`.  
Pour m’en affranchir, j’ajoute mon utilisateur au groupe `microk8s` :

```
sudo usermod -a -G microk8s $USER
newgrp microk8s
```

---

## Étape 3 — Vérification du bon fonctionnement

Je vérifie que le cluster est bien installé et prêt :

```
microk8s status --wait-ready
```

---

## Étape 4 — Activation des modules essentiels

J’active les composants suivants :

```
microk8s enable dns ingress storage
```

Explications rapides :
- `dns` : résolution de noms interne au cluster
- `ingress` : Ingress Controller (reverse proxy nginx)
- `storage` : gestion de volumes persistants

---

## Étape 5 — Test du cluster

Je vérifie que tout est bien en place avec :

```
microk8s kubectl get all -A
```

---

## Étape 6 — Utilisation de kubectl sans microk8s

Pour utiliser directement `kubectl` sans préfixe, j’exporte la config :

```
microk8s config > ~/.kube/config
```

---

## Étape 7 — Ouverture des ports avec UFW

Je configure le pare-feu (`ufw`) pour autoriser les connexions indispensables :

```
sudo ufw allow 22/tcp     # SSH
sudo ufw allow 80,443/tcp # HTTP / HTTPS (Ingress)
sudo ufw allow 16443/tcp  # API Kubernetes
sudo ufw enable
```

---

## Cluster prêt 🚀

Le cluster Kubernetes est maintenant prêt à accueillir mes futurs déploiements.

Dans le prochain article, je m’attaque à la **construction de l’image Docker** de mon site, et à la **mise en place de la première pipeline CI/CD** pour la publier automatiquement.
