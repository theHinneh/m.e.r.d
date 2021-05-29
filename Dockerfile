FROM node:14
WORKDIR /app

COPY package.json .
# RUN npm i

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm i; \
    else npm i --only=production; \
    fi

COPY . .
ENV PORT 3000
EXPOSE $PORT
CMD ["node", "index.js"]