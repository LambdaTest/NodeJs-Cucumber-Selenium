exports.config = {
 user: '<YOUR LAMBDATEST USERNAME>',
  key: '<YOUR LAMBDATEST KEY>',
  server: 'hub.lambdatest.com',

  capabilities: [{
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '70.0',
    name: "single_test",
    build: "cucumber-js-LambdaTest-single",
    'video': true,
    'network': true,
    'console': true,
    'visual': true,
  }]
}
