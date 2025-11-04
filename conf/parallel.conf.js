export const config = {
  user: process.env.LT_USERNAME || '<YOUR LAMBDATEST USERNAME>',
  key: process.env.LT_ACCESS_KEY || '<YOUR LAMBDATEST KEY>',
  server: 'hub.lambdatest.com',

  commonCapabilities: {
    name: 'cucumber-js-LambdaTest-parallel-tests',
    build: 'cucumber-js-LambdaTest-parallel',
  },

  capabilities: [
    {
      browserName: 'chrome',
      platform: 'Windows 10',
      version: 'latest',
    },
    {
      browserName: 'firefox',
      platform: 'Windows 10',
      version: 'latest',
    },
    {
      browserName: 'safari',
      platform: 'macOS 10.14',
      version: 'latest',
    },
    {
      browserName: 'internet explorer',
      platform: 'Windows 10',
      version: 'latest',
    },
  ],
};

// Apply common capabilities to each browser config
config.capabilities.forEach((caps) => {
  for (const key in config.commonCapabilities) {
    caps[key] = caps[key] || config.commonCapabilities[key];
  }
});
