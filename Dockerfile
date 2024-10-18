### Base
FROM node:18-alpine as base
ENV NODE_ENV=production

RUN apk update --no-cache
RUN mkdir /app && chown -R node:node /app

USER node
WORKDIR /app

# Copy base dependencies describing
COPY --chown=node:node ./src ./src
COPY --chown=node:node ./nest-cli.json ./
COPY --chown=node:node ./package*.json ./
COPY --chown=node:node ./tsconfig*.json ./

RUN npm install --only=production


### Builder
FROM base as builder

RUN npm install --production=false
RUN npm run build


### Runtime
FROM node:18-alpine as runtime
ENV NODE_ENV=production
WORKDIR /app

# Copy runtime dependencies
COPY --chown=node:node --from=base /app/node_modules ./node_modules
COPY --chown=node:node .env.${NODE_ENV} ./
COPY --chown=node:node --from=base /app/package.json ./
COPY --chown=node:node --from=builder /app/dist ./dist

CMD ["npm", "run", "start:prod"]
