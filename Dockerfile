FROM node:lts-alpine as build

RUN apk --update --no-cache add python build-base

WORKDIR /app

COPY . .
RUN npm install \
 && npm run build \
 && npm prune --production

####################################################

FROM node:lts-alpine

WORKDIR /app

COPY --from=build /app/package.json .
COPY --from=build /app/dist dist
COPY --from=build /app/node_modules node_modules

ENV PORT 80

EXPOSE 80

CMD ["npm", "start"]

