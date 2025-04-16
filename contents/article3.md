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
coverImage: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pvklof8jitk5r1doq4vh.png
coverImageAlt: GithubActions + Dockerfile logos
title: Article 3 - Docker + GitHub Actions
excerpt:
  Automatisation du build Docker de mon portfolio avec GitHub Actions, publication sur Docker Hub et redéploiement transparent sur Kubernetes.
slug: automatisation-deploiement-portfolio3
featured: false
category: DevOps & Développement
language: French
---

## Automatiser le build et le push d’une app Node.js

Dans cette troisième étape, je m’attaque à la **conteneurisation de mon application** Next.js (portfolio personnel), et à la mise en place d’une **pipeline CI/CD** pour automatiser le build de l’image Docker, son push sur Docker Hub, et le redéploiement automatique sur Kubernetes.

---

## CI/CD : création de l’image Docker

L’objectif est de :

- Produire une image Docker légère et optimisée
- La publier automatiquement sur **Docker Hub**
- Redémarrer le déploiement sur le cluster **sans downtime**

Tout est défini dans une pipeline GitHub Actions située dans le dépôt de mon application, sous `.github/workflows/deploy.yml`.

---

## Construction de l’image Docker

Voici le `Dockerfile` utilisé :

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build

FROM node:18-alpine AS runtime

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]
```

🧠 Quelques remarques :
- **Multi-stage build** : pour séparer la phase de build et l’environnement d’exécution.
- **Base alpine** : pour une image plus légère.
- **`package*.json` copié avant le code** : permet de **cacher la couche de dépendances** tant que `package.json` ne change pas → gain de temps.
- Le `EXPOSE 3000` est **informel** (utile pour la doc ou des outils comme Docker Desktop), mais ce n’est pas lui qui publie le port.

---

## Pipeline dans le dépôt applicatif

La pipeline `deploy.yml` contient deux jobs :  
1. Le **build & push** de l’image  
2. Le **redéploiement sur le cluster Kubernetes**

```yaml
name: Deploy Website

on:
  push:
    branches:
      - main
  workflow_dispatch:

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

  rollout_k8s:
    name: Restart Kubernetes Deployment
    runs-on: ubuntu-latest
    needs: build_push_image

    steps:
      - name: Set up Kubernetes context
        uses: azure/k8s-set-context@v3
        with:
          kubeconfig: ${{ secrets.KUBECONFIG }}

      - name: Restart Deployment
        run: |
          kubectl rollout restart deployment/${{ env.DEPLOYMENT_NAME }} -n ${{ env.NAMESPACE }}
          kubectl rollout status deployment/${{ env.DEPLOYMENT_NAME }} -n ${{ env.NAMESPACE }}
```

---

## Gestion des secrets

Aucun identifiant n’est codé en dur. Tout est stocké de manière sécurisée via les **GitHub Secrets** :

- `DOCKER_USERNAME` / `DOCKER_PASSWORD` → pour Docker Hub
- `KUBECONFIG` → pour se connecter à mon cluster MicroK8s à distance

---

## Résultat

✅ Chaque push sur `main` génère une image Docker à jour, la publie automatiquement, et redéploie l’application sans downtime.

➡️ Dans le prochain article, je vous explique comment j’ai versionné **l’infrastructure Kubernetes** dans un second dépôt, et mis en place une **pipeline GitOps** pour garder le cluster synchronisé.
