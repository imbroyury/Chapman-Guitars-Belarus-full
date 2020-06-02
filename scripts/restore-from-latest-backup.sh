#!/usr/bin/env bash

set -o nounset;
set -o pipefail;
set -o errexit;
set -o xtrace;

cd ../backup;

# sql restore
mysql -u root -p chapman < ./latest/chapman.sql;

# also files
cp ./latest/server/server-log.log ../server/server-log.log;
cp ./latest/static/sitemap.xml ../static/sitemap.xml;
cp -r ./latest/static/uploads/* ../static/uploads;
