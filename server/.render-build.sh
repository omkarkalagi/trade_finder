#!/bin/bash
echo "----- Starting Build Process -----"

# Install dependencies
npm install --omit=dev

# Optimize build
rm -rf node_modules/.cache
find . -name "*.test.js" -delete

echo "----- Build Complete -----"
