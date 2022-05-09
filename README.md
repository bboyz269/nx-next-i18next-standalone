# nx next i18next standalone build

Experimental standalone docker build for for next app with next-i18next in nx workspace

## Run / build
### Dev
```
nx serve
# http://localhost:4200/ja
```

### Standalone prod docker
```
docker build . -t nx-next-i18next-standalone --build-arg APP=nx-next-i18next-standalone
docker run -d -p 3000:3000 nx-next-i18next-standalone
# http://localhost:3000/ja
```

##

## Points of interest

### stand alone build 
https://github.com/nrwl/nx/issues/9017

*./apps/nx-next-i18next-standalone/next.config.js*
```js
const { join } = require('path')

modules.export = {
  experimental: {
    outputStandalone: true,
    outputFileTracingRoot: join(__dirname, '../../')
  }
}
```

*Dockerfile*
```docker
FROM node:16-alpine AS runner
ARG APP=nx-next-standalone
COPY --from=builder --chown=nextjs:nodejs /build/dist/apps/${APP}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /build/dist/apps/${APP}/.next/static ./dist/apps/${APP}/.next/static/
COPY --from=builder --chown=nextjs:nodejs /build/dist/apps/${APP}/public/ ./apps/${APP}/public/
```

### nx next-i18next
https://github.com/nrwl/nx/discussions/4983

*./apps/nx-next-i18next-standalone/next-i18next.config.js*
```js
module.exports = {
  localePath: resolve('./apps/nx-next-i18next-standalone/public/locales')
}
```

*./apps/nx-next-i18next-standalone/pages/index.tsx*
```ts
export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
  };
}
```

*Dockerfile*
```docker
FROM node:16-alpine AS builder
ARG APP=nx-next-i18next-standalone
RUN npx nx build ${APP} \
    && mv ./dist/apps/${APP}/public/locales ./dist/apps/${APP}/locales

FROM node:16-alpine AS runner
ARG APP=nx-next-i18next-standalone
COPY --from=builder --chown=nextjs:nodejs /build/dist/apps/${APP}/locales ./apps/${APP}/apps/${APP}/public/locales
```

## Others

By default, standalone build create a next server at `localhost:${process.env.PORT}`.  Following allows changing the host name:  

*Dockerfile*
```
RUN sed -i -e "s|'localhost'|process.env.HOSTNAME|g" ./dist/apps/${APP}/.next/standalone/apps/${APP}/server.js
```