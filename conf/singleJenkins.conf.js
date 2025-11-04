export const config = {
  user: process.env.LT_USERNAME || '<YOUR LAMBDATEST USERNAME>',
  key: process.env.LT_ACCESS_KEY || '<YOUR LAMBDATEST KEY>',
  server: 'hub.lambdatest.com',

  capabilities: [
    {
      browserName: process.env.LT_BROWSER_NAME || 'chrome',
      platform: process.env.LT_PLATFORM || 'Windows 10',
      version: process.env.LT_BROWSER_VERSION || 'latest',
      name: 'cucumber-js-single-test',
      build: 'cucumber-js-LambdaTest-single'
    }
  ]
};
