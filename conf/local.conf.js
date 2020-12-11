exports.config = {
  user: process.env.LT_USERNAME || '<YOUR LAMBDATEST USERNAME>',
  key: process.env.LT_ACCESS_KEY || '<YOUR LAMBDATEST KEY>',
  server: 'hub.lambdatest.com',

  capabilities: [{
    browserName: 'chrome',
    platform: 'Windows 10',
    version: 'latest',
    name: "cucumebrjs-local-test",
    build: "cucumber-js-LambdaTest",
    tunnel: 'true',
  }]
}
