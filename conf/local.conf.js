exports.config = {
  user: 'YOUR LAMBDATEST USERNAME',
  key: 'YOUR LAMBDATEST ACCESSKEY',
  server: 'hub.lambdatest.com',

  capabilities: [{
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '70.0',
    name: "local_test",
    build: "cucumber-js-LambdaTest"
  }]
}
