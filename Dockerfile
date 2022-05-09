# Install dependencies only when needed
FROM node:16-alpine AS deps
WORKDIR /build
COPY package.json yarn.lock ./
RUN apk add --no-cache --allow-untrusted libc6-compat
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
ARG APP=nx-next-i18next-standalone
WORKDIR /build
COPY --from=deps /build/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npx nx build ${APP} \
    && mv ./dist/apps/${APP}/public/locales ./dist/apps/${APP}/locales \
    && sed -i -e "s|'localhost'|process.env.HOSTNAME|g" ./dist/apps/${APP}/.next/standalone/apps/${APP}/server.js


# Production image, copy all the files and run next
FROM node:16-alpine AS runner
ARG APP=nx-next-i18next-standalone
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    APP_PATH=apps/${APP}/server.js

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /build/dist/apps/${APP}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /build/dist/apps/${APP}/.next/static ./dist/apps/${APP}/.next/static/
COPY --from=builder --chown=nextjs:nodejs /build/dist/apps/${APP}/locales ./apps/${APP}/apps/${APP}/public/locales
COPY --from=builder --chown=nextjs:nodejs /build/dist/apps/${APP}/public/ ./apps/${APP}/public/

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD node $APP_PATH
