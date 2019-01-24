exports.config = {
  user: process.env.LT_USERNAME,
  key: process.env.LT_ACCESS_KEY,
  server: 'hub.lambdatest.com',

  capabilities: [{
    browserName: process.env.LT_BROWSER_NAME,
    platform: process.env.LT_PLATFORM,
    version: process.env.LT_BROWSER_VERSION,
    name: "single_test",
    build: "cucumber-js-LambdaTest-single",
    'video': true,
    'network': true,
    'console': true,
    'visual': true,
  }]
}
