#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configFile = path.resolve(
  __dirname,
  `../conf/${process.env.CONFIG_FILE || 'single'}.conf.js`
);

// Dynamically import the config file
const { config } = await import(configFile);

process.argv[0] = 'node';
process.argv[1] = './node_modules/.bin/cucumber-js';

for (let i = 0; i < config.capabilities.length; i++) {
  const env = { ...process.env, TASK_ID: i.toString() };
  const child = spawn('/usr/bin/env', process.argv, { env });

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}
