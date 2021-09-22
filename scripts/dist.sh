#!/bin/bash
tsc
cp -r assets bin
json -f package.json -e 'this.main = "./Jambot.js"; this.typings = "./Jambot"' > ./bin/package.json