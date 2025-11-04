import { Before, After } from '@cucumber/cucumber';
import { Builder } from 'selenium-webdriver';
import lambdaTunnel from '@lambdatest/node-tunnel';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// --- Resolve config file dynamically ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.resolve(
  __dirname,
  `../../conf/${process.env.CONFIG_FILE || 'single'}.conf.js`
);

// Use top-level await to import config cleanly as ESM
const { config } = await import(pathToFileURL(configPath).href);

const tunnelArgs = { user: config.user, key: config.key };
const myTunnel = new lambdaTunnel();

// --- Helper: create LambdaTest session ---
async function createLambdaTestSession(config, caps) {
  const gridUrl = `https://${config.user}:${config.key}@${config.server}/wd/hub`;
  console.log(`Connecting to: ${gridUrl}`);

  return new Builder().usingServer(gridUrl).withCapabilities(caps).build();
}

// --- Hooks ---
Before({ timeout: 100000 }, async function () {
  const taskId = parseInt(process.env.TASK_ID || '0', 10);
  const caps = config.capabilities[taskId];

  if (caps.tunnel) {
    console.log(
      `Starting LambdaTest Tunnel for ${caps.browserName} | Build: ${caps.build}`
    );

    await new Promise((resolve, reject) => {
      myTunnel.start(tunnelArgs, (err, status) => {
        if (err) {
          console.error('Tunnel failed to start:', err);
          return reject(err);
        }
        console.log('Tunnel started:', status);
        resolve(status);
      });
    });
  }

  console.log('TUNNEL STATUS (Before):', myTunnel.isRunning());
  this.driver = await createLambdaTestSession(config, caps);
});

After({ timeout: 100000 }, async function () {
  console.log('TUNNEL STATUS (After):', myTunnel.isRunning());

  if (this.driver) {
    try {
      await this.driver.quit();
    } catch (e) {
      console.error('Error quitting driver:', e);
    }
  }

  if (myTunnel.isRunning()) {
    await new Promise((resolve) => {
      myTunnel.stop(() => {
        console.log('Tunnel stopped successfully.');
        resolve();
      });
    });
  }
});
