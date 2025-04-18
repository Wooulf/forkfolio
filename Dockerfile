# Étape 1 — Build de l'application
FROM node:23-alpine AS builder
WORKDIR /app

# Prend en charge les variables d'environnement build-time
ARG NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_EMAIL

# Injecte les variables dans le build
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_EMAIL=$NEXT_PUBLIC_EMAIL

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

# Étape 2 — Runtime minimal et sécurisé
FROM node:23-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Crée un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

# Copie uniquement les fichiers nécessaires au runtime
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
