FROM node:alpine as build
ARG BUILD_CONTEXT

WORKDIR /base

# install dependencies
COPY package.json .
COPY yarn.lock .
COPY ./packages/common/package.json packages/common/
COPY ./packages/$BUILD_CONTEXT/package.json packages/$BUILD_CONTEXT/
RUN yarn install
# build
COPY ./packages/common packages/common
COPY ./packages/$BUILD_CONTEXT packages/$BUILD_CONTEXT
RUN yarn workspace @microservice-blog/common run build
# RUN yarn workspace @microservice-blog/$BUILD_CONTEXT run build

FROM node:alpine as app
WORKDIR /app
ARG BUILD_CONTEXT
COPY --from=build /base .

WORKDIR /app/packages/$BUILD_CONTEXT

CMD ["npm", "start"]
