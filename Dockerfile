FROM node:10
WORKDIR "/app"
RUN apt-get update && apt-get dist-upgrade -y \ 
    && apt-get clean \
    && echo "Finished installing dependencies"

COPY package*.json ./
RUN npm install --production
RUN npm install -g typescript
COPY . /app
RUN tsc ./hello.ts

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

USER node
CMD ["node", "hello.js"]