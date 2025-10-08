#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const collectFiles = (directory, matches) => {
  fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, matches);
    } else if (fullPath.endsWith('.module.scss')) {
      matches.push(fullPath);
    }
  });
};

const run = () => {
  const root = path.join(__dirname, '..');
  const matches = [];
  collectFiles(root, matches);
  if (matches.length > 0) {
    console.error('Found forbidden .module.scss files:', matches);
    process.exit(1);
  }
};

run();
