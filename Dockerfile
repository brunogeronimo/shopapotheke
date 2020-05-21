FROM node:14.2.0-alpine AS base

WORKDIR /app
COPY . /app
RUN npm ci
RUN npm run build

CMD ["npm", "run", "start:dev"]

FROM node:14.2.0-alpine AS prod

WORKDIR /app
COPY --from=base /app/dist/ /app/
COPY --from=base /app/package* /app/

ENV NODE_ENV=production

RUN npm ci && npm prune

CMD ["npm", "start"]