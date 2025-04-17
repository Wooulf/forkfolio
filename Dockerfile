# Étape 1 — Base commune avec installation des dépendances prod
FROM node:23-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Étape 2 — Build de l'application en mode standalone
FROM base AS builder
COPY . .
RUN npm run build

# Étape 3 — Runtime minimal, sécurisé et sans devDependencies
FROM node:23-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Création d’un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

# Copie des fichiers nécessaires uniquement
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]
