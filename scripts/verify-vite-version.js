#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const run = () => {
  const packagePath = path.join(__dirname, '..', 'client', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  const viteVersion = packageJson.devDependencies?.vite;
  if (viteVersion !== 'latest') {
    console.error('Vite version must be set to "latest".');
    process.exit(1);
  }
};

run();
