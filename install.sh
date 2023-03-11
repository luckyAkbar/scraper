#!/bin/bash

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash;
export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;

PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true;
apt-get update && apt-get install curl gnupg -y &&
curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - &&
sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' &&
apt-get update   && apt-get install google-chrome-stable -y --no-install-recommends && rm -rf /var/lib/apt/lists/* &&
nvm install 16.17.0 &&
nvm use 16.17.0 &&
npm i
return 0;