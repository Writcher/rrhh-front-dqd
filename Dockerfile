# ============================================================
# Etapa 1: deps
# Solo instalación de dependencias (cacheada agresivamente)
# ============================================================
FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci


# ============================================================
# Etapa 2: builder
# Compila Next.js con output: 'standalone'
# ============================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Trae node_modules cacheado desde la etapa anterior.
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Telemetría off; ahorra ruido en build.
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build


# ============================================================
# Etapa 3: runtime
# Imagen final: solo el server standalone + static + public
# ============================================================
FROM node:22-alpine AS runtime

WORKDIR /app

RUN apk add --no-cache tzdata

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=7257
ENV HOSTNAME=0.0.0.0

# server.js + node_modules mínimo + package.json
COPY --from=builder /app/.next/standalone ./
# Assets estáticos (CSS, JS chunks, etc.) — Next los espera en .next/static
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 7257

CMD ["node", "server.js"]