#!/bin/bash
# Build script for Vercel deployment

# Make sure we have the right permissions
chmod +x node_modules/.bin/vite

# Run the build
npx vite build
