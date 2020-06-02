#!/usr/bin/env bash

set -o nounset;
set -o pipefail;
set -o errexit;
set -o xtrace;

cd ../backup;

# sql restore
mysql -u root -p < ./0/chapman.sql;

# also files
cp ./0/server/server-log.log ../server/server-log.log;
cp ./0/static/sitemap.xml ../static/sitemap.xml;
cp -r ./0/static/uploads/* ../static/uploads;
