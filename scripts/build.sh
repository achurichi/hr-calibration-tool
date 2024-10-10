#!/bin/bash

# Build the ui
cd ui 
npm run build

# Remove build directory if exists
cd ..
rm -rf build
mkdir -p build/ui build/api

# Copy the content from ui/dist to build/ui
cp -r ui/dist/* build/ui/

# Copy the content from api to build/api
cp -r api/src api/package.json api/.env build/api/

