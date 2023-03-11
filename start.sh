#!/bin/bash

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash;
export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;

nvm install 16.17.0 &&
nvm use 16.17.0 &&
npm i &&
npm run build &&
npm run start-dev