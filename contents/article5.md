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
coverImage: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9nxgiyguzjib473ui1h5.png
coverImageAlt: Cert-manager & Let's Encrypt logos
title: Article 5 - Finalisation de l’HTTPS et perspectives d'évolution
excerpt:
  Mise en place d’un certificat HTTPS via Let’s Encrypt et cert-manager, avec configuration des challenges et annotations de sécurité dans l’Ingress Kubernetes.
slug: automatisation-deploiement-portfolio5
featured: false
category: DevOps & Développement
language: French
---

Dans cette cinquième étape, je reviens sur la mise en place d’un certificat SSL/TLS pour sécuriser le site **woulf.fr**, toujours dans une optique DevOps. Nous allons voir :

1. **Pourquoi Let’s Encrypt**
2. **Pourquoi cert-manager**
3. **Les annotations essentielles** (`ssl-redirect`, `hsts-max-age`)

---

## Contexte du projet

Au fil des articles précédents, j’ai :

- Déployé un cluster Kubernetes via **MicroK8s** sur un VPS.
- Conteneurisé mon application avec **Docker**.
- Mis en place une **CI/CD GitHub Actions** pour builder et publier automatiquement l’image Docker.
- Séparé **code applicatif** et **infrastructure** dans deux dépôts Git distincts.
- Déployé le tout sur Kubernetes avec une logique **GitOps**.

La dernière étape consistait à **sécuriser l’accès au site** avec HTTPS.

---

## Pourquoi Let’s Encrypt ?

[Let’s Encrypt](https://letsencrypt.org) est une autorité de certification gratuite, automatisée et ouverte. C’est aujourd’hui la référence pour obtenir facilement un certificat SSL/TLS valide.

### Avantages :

- **Gratuit** : aucun coût d’émission ni de renouvellement.
- **Automatisé** : compatible avec les outils DevOps et Kubernetes.
- **Reconnu** : les certificats sont valides pour tous les navigateurs modernes.

---

## Pourquoi cert-manager ?

**cert-manager** est un opérateur Kubernetes développé pour gérer automatiquement les certificats (émission, renouvellement, rotation…).

Il permet de :

- **Créer un certificat SSL/TLS** via des objets `Certificate` Kubernetes.
- **Effectuer la validation (challenge)** automatiquement auprès de Let’s Encrypt.
- **Gérer les renouvellements** sans aucune intervention manuelle.

Il s’intègre très bien dans un workflow GitOps : on peut versionner les certificats et leur configuration dans le repo d’infra.

---

## Fonctionnement du challenge HTTP-01

Pour vérifier que je suis bien propriétaire du nom de domaine, Let’s Encrypt effectue une **vérification via HTTP** :

1. cert-manager crée un `Challenge` avec une URL spéciale sur le domaine :
   ```
   http://woulf.fr/.well-known/acme-challenge/<token>
   ```
2. Il lance un **pod `acmesolver`** temporaire qui répond à cette URL avec une clé unique.
3. Let’s Encrypt interroge l’URL :
   - Si la bonne clé est retournée, le certificat est délivré.
   - Sinon, la validation échoue.

Avec l’ajout de l’annotation suivante dans l’Ingress :
```
acme.cert-manager.io/http01-edit-in-place: "true"
```
le challenge HTTP est directement intégré dans l’Ingress principal, ce qui évite des conflits (que j'ai eu avec des Ingress/POD dédiés au solver).

---

## Ajout d'annotations pour une sécurité supplémentaire

### `nginx.ingress.kubernetes.io/ssl-redirect`

```
nginx.ingress.kubernetes.io/ssl-redirect: "true"
```

> Forcer automatiquement la redirection HTTP vers HTTPS.

Une fois le certificat valide, on peut s'assurer que les utilisateurs accèdent toujours au site en HTTPS.

---

### `nginx.ingress.kubernetes.io/hsts-max-age`

```
nginx.ingress.kubernetes.io/hsts-max-age: "31536000"
```

> Ajoute un en-tête HSTS (HTTP Strict Transport Security) pour dire aux navigateurs de **refuser toute future connexion en HTTP** pendant 1 an (31 536 000 secondes).

⚠️ Attention à ne l’activer **qu’après avoir vérifié que HTTPS fonctionne**, car cela empêche tout retour vers HTTP.

---

## Exemple final de configuration

Voici un extrait du fichier `Ingress` après intégration des bonnes pratiques :

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: woulf-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    acme.cert-manager.io/http01-edit-in-place: "true"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/hsts-max-age: "31536000"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - woulf.fr
      secretName: woulf-fr-tls
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
```

---

## Ce qu’il reste à faire

✅ Le site est maintenant accessible en HTTPS, avec un certificat **Let’s Encrypt** automatiquement géré par **cert-manager**.  
Voici ce que je prévois pour la suite :

- **Monitoring** : mettre en place un stack Prometheus / Grafana.
- **Logs centralisés** : avec Loki ou EFK.
- **GitOps avancé** : tester ArgoCD ou Flux pour observer et réconcilier les états du cluster.


---

Ce projet est un premier pas vers une infrastructure entièrement automatisée et maintenable. Et ce n’est que le début 👨‍🚀
