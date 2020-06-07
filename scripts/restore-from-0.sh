#!/usr/bin/env bash

set -o nounset;
set -o pipefail;
set -o errexit;
set -o xtrace;

cd ../backup;

BACKUP_FOLDER="0"

# sql restore
mysql < ./${BACKUP_FOLDER}/chapman.sql;

# also files
cp ./${BACKUP_FOLDER}/server/server-log.log ../server/server-log.log;
cp ./${BACKUP_FOLDER}/static/sitemap.xml ../static/sitemap.xml;
cp -r ./${BACKUP_FOLDER}/static/uploads/* ../static/uploads;
