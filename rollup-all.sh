#! /bin/bash

export BASE=/Volumes/StorageDrive/jmthompson/git/filtered-react-table
export BIN=${BASE}/node_modules/rollup/dist/bin

${BIN}/rollup -c
${BIN}/rollup -c rollup.config.terser.js
