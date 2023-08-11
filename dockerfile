FROM --platform=linux/amd64 node:lts-alpine AS builder

WORKDIR /build

COPY . .

RUN npm i
RUN npx tsc

FROM --platform=linux/amd64 node:lts-alpine as app

ENV node_env=production

WORKDIR /server

COPY --from=builder /build/dist /server/
COPY --from=builder /build/node_modules /server/node_modules

ENV NODE_ENV=production
ENV botApiToken=
ENV clientId=
ENV guildId=
ENV welcome_channel=
ENV welcome_role=
ENV birthday_role=

#db settings

ENV dbHost=
ENV dbPort=
ENV database=
ENV dbUsername=
ENV dbPassword=

CMD ["node", "./main.js"]