#!/usr/bin/env bash

set -o nounset;
set -o pipefail;
set -o errexit;
set -o xtrace;

cd ../backup;

# prepare folders
mkdir ~tmp;
mkdir ~tmp/ser
ver;
mkdir ~tmp/static;

# sql dump
mysqldump -u root -p --databases --add-drop-database chapman > ./~tmp/chapman.sql;

# also files
cp ../server/server-log.log ./~tmp/server/server-log.log;
cp ../static/sitemap.xml ./~tmp/static/sitemap.xml;
cp -r ../static/uploads ./~tmp/static/uploads;

# when all done, remove old backup
rm -rf latest;
mkdir latest;

mv ~tmp/* latest;
rm -rf ~tmp;