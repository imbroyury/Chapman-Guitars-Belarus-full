#!/usr/bin/env bash

set -o nounset;
set -o pipefail;
set -o errexit;
set -o xtrace;

cd ../backup;

# prepare folders
mkdir ~tmp;
mkdir ~tmp/server;
mkdir ~tmp/static;

# sql dump
mysqldump --add-drop-database chapman > ./~tmp/chapman.sql;

# also files
cp ../server/server-log.log ./~tmp/server/server-log.log;
cp ../static/sitemap.xml ./~tmp/static/sitemap.xml;
cp -r ../static/uploads ./~tmp/static/uploads;

# when all done, remove old backup
rm -rf latest;
mkdir latest;

# and move current one in its place
mv ~tmp/* latest;
rm -rf ~tmp;