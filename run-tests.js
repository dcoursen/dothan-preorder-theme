#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const isHeaded = args.includes('--headed');
const isDebug = args.includes('--debug');
const testFile = args.find(arg => arg.endsWith('.test.js'));

// Set up environment variables
const env = {
  ...process.env,
  HEADLESS: isHeaded ? 'false' : 'true'
};

// Build command
let command = 'npx';
let commandArgs = ['jest'];

if (isDebug) {
  command = 'node';
  commandArgs = ['--inspect-brk', './node_modules/.bin/jest', '--runInBand'];
}

if (testFile) {
  commandArgs.push(testFile);
}

// Add any other jest arguments
const jestArgs = args.filter(arg => 
  !arg.startsWith('--headed') && 
  !arg.startsWith('--debug') && 
  !arg.endsWith('.test.js')
);
commandArgs.push(...jestArgs);

console.log(`Running: ${command} ${commandArgs.join(' ')}`);
console.log(`Headless: ${env.HEADLESS}`);

// Run tests
const child = spawn(command, commandArgs, {
  env,
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code);
});

child.on('error', (err) => {
  console.error('Failed to start test process:', err);
  process.exit(1);
});