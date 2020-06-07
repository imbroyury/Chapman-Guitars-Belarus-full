#!/usr/bin/env bash

set -o nounset;
set -o pipefail;
set -o errexit;
set -o xtrace;

NODE_ENV=production ./node_modules/.bin/pm2 start ./server/index.js --node-args "-r esm";
