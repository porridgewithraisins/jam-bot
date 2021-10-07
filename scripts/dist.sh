#!/bin/bash

# removes unused imports
eslint "src/**" --fix
# 
prettier --write src/

#builds typescript based on tsconfig.json
tsc

cp -r assets bin

# bin folder has its own copy of package.json relative to 
# which npm publish is run
json -f package.json -e 'this.main = "./Jambot.js"' > ./bin/package.json
json -f package.json -e 'this.typings = "./Jambot"' > ./bin/package.json