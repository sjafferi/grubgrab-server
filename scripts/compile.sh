#!/bin/bash

rm -rf ./lib

npm run build:types
npm run build:js
