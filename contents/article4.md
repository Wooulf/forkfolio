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
coverImage: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/igr6uvksvy20ot1wqof3.png
coverImageAlt: GitOps K8s scheme
title: Article 4 - Déploiement Kubernetes avec GitOps
excerpt:
  Déploiement de mon infrastructure Kubernetes versionnée avec GitOps, avec application automatisée via une pipeline dédiée et exposition publique de mon portfolio.
slug: automatisation-deploiement-portfolio4
featured: false
category: DevOps & Développement
language: French
---

Après avoir mis en place le build et le push de mon image Docker, il est temps d’aller plus loin : **versionner et automatiser le déploiement de mon infrastructure Kubernetes**.

---

## Séparation des responsabilités : code vs infra

Pour garder une architecture propre et maintenir une logique GitOps, j’ai séparé l’infrastructure du code applicatif dans deux dépôts Git différents :

- [`Wooulf/forkfolio`](https://github.com/Wooulf/forkfolio) : contient le code source de mon site (Next.js), le `Dockerfile` et une pipeline CI pour builder + déployer l’image Docker.
- [`Wooulf/infra-k8s-terraform`](https://github.com/Wooulf/infra-k8s-terraform) : contient **tous les fichiers de configuration Kubernetes** (`deployment.yaml`, `service.yaml`, etc.), et une **autre pipeline CI/CD** dédiée à leur application sur le cluster.

🎯 Ce découpage permet de découpler le code applicatif de l'infrastructure, ce qui facilite la maintenance, les revues de code ciblées, et l’évolution des deux parties de manière indépendante.

---

## Déploiement de l'application sur MicroK8s

Pour que mon application tourne sur le cluster et soit exposée proprement au public, j’ai mis en place les éléments suivants :

- Un **Deployment** : qui gère le cycle de vie du pod (mises à jour, résilience…)
- Un **Service ClusterIP** : pour stabiliser la communication interne vers le pod
- Un **Ingress** : pour router les requêtes HTTP externes vers la bonne application
- Un **Service NodePort** : pour exposer l’Ingress Controller au monde extérieur

---

## Une requête, un chemin

L'ensemble de ces composants permet de faire transiter une requête HTTP entrante à travers le cluster, comme ceci :

> 🌐 `Client` → `VPS` (port 80) → `NodePort` → `Ingress` → `ClusterIP` → `Pod`

Voici un schéma clair et visuel du fonctionnement :

![Schéma de routage Kubernetes vers mon app portfolio](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/abuijcwf91jng0eyr5mf.jpg)

---

## Fichiers de définition Kubernetes

Voici les fichiers versionnés dans le repo d’infra :

### 🧱 Deployment

Gère le déploiement du conteneur, les mises à jour, la redondance.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio
spec:
  replicas: 1
  selector:
    matchLabels:
      app: portfolio
  template:
    metadata:
      labels:
        app: portfolio
    spec:
      containers:
        - name: portfolio
          image: woulf/portfolio:latest
          ports:
            - containerPort: 3000
```

---

### 🌐 Service ClusterIP

Expose le pod à l’intérieur du cluster via une IP stable.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: portfolio
spec:
  selector:
    app: portfolio
  ports:
    - port: 80
      targetPort: 3000
```

---

### 🌍 Ingress

Fait le lien entre un nom de domaine (`woulf.fr`) et le bon service interne.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: woulf-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: woulf.fr
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: portfolio
                port:
                  number: 3000
  ingressClassName: nginx
```

---

### 🛣️ Ingress Controller (NodePort)

Expose le contrôleur nginx de l’Ingress sur un port externe du VPS.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-ingress-microk8s-controller
  namespace: ingress
spec:
  type: NodePort
  externalIPs:
    - 185.216.27.229
  selector:
    name: nginx-ingress-microk8s
  ports:
    - port: 80
      targetPort: 80
      nodePort: 32180
```

---

## Pipeline GitHub Actions dans le repo infra

Une fois les fichiers versionnés, je les applique automatiquement sur mon cluster grâce à une **deuxième pipeline CI/CD** dans le dépôt `infra-k8s-terraform`.

Elle s’exécute dès qu’un fichier est modifié dans le dossier `k8s/` :

```yaml
on:
  push:
    paths:
      - 'k8s/**'

jobs:
  apply_k8s_configs:
    steps:
      - uses: actions/checkout@v4
      - uses: azure/k8s-set-context@v3
        with:
          kubeconfig: ${{ secrets.KUBECONFIG }}
      - run: kubectl apply -f k8s/
      - run: kubectl get all
```

✅ Résultat : à chaque commit de config, **le cluster se synchronise automatiquement**.

---

## Et la suite ?

Je pourrais aller encore plus loin avec un **outil GitOps complet** comme **ArgoCD** ou **Flux**. Ces outils se chargeraient de **surveiller le dépôt Git en continu** et de mettre à jour le cluster **sans passer par une pipeline manuelle**.

Mais pour un MVP, cette solution en deux pipelines fait déjà le job 👌

---

💡 Dans le prochain article, je parlerai de la **gestion des secrets**, du futur passage en **HTTPS**, des idées de **monitoring**, et des prochaines évolutions possibles de mon infrastructure.
