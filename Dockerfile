FROM node:alpine as base

ARG MODEL_PATH

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN npm i -g pnpm

#################################

FROM base as runner

COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile

COPY . .
RUN pnpm build

ENV PORT=3000
ENV HOSTNAME=127.0.0.1
CMD ["pnpm", "next", "start", "-p", "3000"]