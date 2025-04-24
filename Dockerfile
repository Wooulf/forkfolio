# Étape 1 — Base d’image pour builder et runner
FROM node:23-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Étape 2 — Installation des dépendances
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Étape 3 — Build avec récupération sécurisée des articles Dev.to
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_PUBLIC_URL=https://woulf.fr
ENV NEXT_PUBLIC_EMAIL=corentinboucardpro@gmail.com

# Injecte le token Dev.to de façon sécurisée uniquement pendant ce RUN
RUN --mount=type=secret,id=devto_token \
  DEVTO_API_KEY=$(cat /run/secrets/devto_token) node scripts/fetchDevtoArticles.js && npm run build

# Étape 4 — Image finale minimaliste pour l'exécution
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

# Utilisateur non-root
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs && mkdir .next && chown nextjs:nodejs .next

WORKDIR /app

# Copie du nécessaire uniquement
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
