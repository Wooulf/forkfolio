# forkfolio

🚀 Mon portfolio personnel - auto-hébergé, conteneurisé, sécurisé, et déployé via GitOps.  
Un projet vitrine autant pour mon code que pour ma démarche DevOps.

---

## ⚡ Stack technique

- **Framework Front** : Next.js 13 + Tailwind CSS  
- **Contenu** : MDX (Markdown étendu avec React)  
- **Conteneurisation** : Docker (multi-stage)  
- **Orchestration** : Kubernetes (MicroK8s sur VPS)  
- **Déploiement** : CI/CD GitHub Actions  
- **Modèle GitOps** : dépôt infra distinct appliquant les changements automatiquement  
- **Certificats SSL** : cert-manager + Let’s Encrypt  
- **Nom de domaine** : [woulf.fr](https://woulf.fr)

---

## 🚀 Ce que fait le projet

- Compile mon site en conteneur Next.js optimisé
- Déploie automatiquement l’image sur mon cluster Kubernetes
- Expose le site via Ingress NGINX avec HTTPS géré automatiquement
- Synchronise automatiquement les fichiers Kubernetes via GitOps

---

## 📁 Organisation des dépôts

- [`Wooulf/forkfolio`](https://github.com/Wooulf/forkfolio) : Code source de l'application (Next.js, Dockerfile, CI)
- [`Wooulf/infra-k8s-terraform`](https://github.com/Wooulf/infra-k8s-terraform) : Fichiers Kubernetes + pipeline GitOps

---

## 📚 Articles associés

📝 Je documente chaque étape sur Dev.to :  
- [Article 1 - Mise en place d’un déploiement GitOps minimaliste](https://dev.to/woulf/article-1-mise-en-place-dun-deploiement-gitops-minimaliste-4pj3)
- [Article 2 - Installation et configuration de MicroK8s](https://dev.to/woulf/article-2-installation-et-configuration-de-microk8s-1fne)
- [Article 3 - Docker + GitHub Actions ](https://dev.to/woulf/article-3-docker-github-actions-4jno)
- [Article 4 - Déploiement Kubernetes avec GitOps](https://dev.to/woulf/article-4-deploiement-kubernetes-avec-gitops-55gf)
- [Article 5 - Finalisation de l’HTTPS et perspectives d'évolution](https://dev.to/woulf/article-5-finalisation-de-lhttps-et-perspectives-devolution-54e2)  
➡️ *[À venir] Monitoring, scaling, observabilité...*

🧠 *Les articles seront bientôt disponibles aussi sur mon blog [woulf.fr/blog](https://woulf.fr/blog), une fois la synchronisation automatique mise en place. (Ils sont déjà publiés mais pas encore synchronisés automatiquement.)*

---

## 📌 Roadmap (par étapes réelles)

✅ **Étape 1 : MVP GitOps**  
- [x] Initialisation du repo applicatif et infra séparés  
- [x] Déploiement d’un cluster MicroK8s sur un VPS  
- [x] Configuration des Ingress et services  
- [x] Pipeline GitHub Actions (build image + `kubectl apply`)  

✅ **Étape 2 : Production minimale sécurisée**  
- [x] Ajout d’un certificat HTTPS via cert-manager  
- [x] Intégration Let’s Encrypt avec validation HTTP-01  
- [x] Ajout des annotations de sécurité (ssl-redirect, HSTS)

🔜 **Étape 3 : Observabilité + scaling**  
- [ ] Stack Prometheus / Grafana  
- [ ] Centralisation des logs (EFK / Loki)  
- [ ] Passage éventuel sur ArgoCD pour GitOps avancé  
- [ ] Tests sur cluster scalable (K3s, etc.)

---

## ✨ Pourquoi ce projet ?

> Construire un site, c’est bien.  
> Le déployer proprement, automatiquement, et de façon sécurisée, c’est mieux.

Ce portfolio est l’occasion pour moi de mettre en œuvre concrètement :
- Une approche DevOps de bout en bout
- Des bonnes pratiques en CI/CD, GitOps et sécurité
- Une infrastructure reproductible, versionnée, et évolutive

---

## 📬 Contact

📣 Je suis en recherche d’opportunités pour **intégrer une équipe DevOps** en tant que **profil junior**.  
J’ai envie d’apprendre, de monter en compétences, et de contribuer à des projets concrets dans un cadre structurant.  
N’hésite pas à me contacter 👇

📧 **Email** : [corentin33boucard@gmail.com](mailto:corentin33boucard@gmail.com)  
🐙 **GitHub** : [github.com/Wooulf](https://github.com/Wooulf)  
💼 **LinkedIn** : [linkedin.com/in/corentin-boucard](https://www.linkedin.com/in/corentin-boucard)
