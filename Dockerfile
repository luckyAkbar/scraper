FROM node:16.17.0-alpine

WORKDIR /app

RUN apk install curl 

RUN curl -sL https://deb.nodesource.com/setup_14.x | /bin/bash -
RUN apk install -y gconf-service libasound2 libatk1.0-0 libc6 \
    libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 \
    libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 \ 
    libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \ 
    libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
    libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 \
    lsb-release xdg-utils wget libgbm-dev libxshmfence-dev

RUN npm install --global --unsafe-perm puppeteer
RUN sudo chmod -R o+rx /usr/lib/node_modules/puppeteer/.local-chromium

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "./build/console/server.js"]