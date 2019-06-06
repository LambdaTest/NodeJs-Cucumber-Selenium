exports.config = {
  user: process.env.LT_USERNAME || '<YOUR LAMBDATEST USERNAME>',
  key: process.env.LT_ACCESS_KEY || '<YOUR LAMBDATEST KEY>',
  server: 'hub.lambdatest.com',

  commonCapabilities: {
    name: "parallel_test",
    build: "cucumber-js-LambdaTest-parallel",
    'video': true,
    'network': true,
    'console': true,
    'visual': true,
  },

  capabilities: [{
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '70.0'
  },{
    browserName: 'firefox',
    platform: 'Windows 10',
    version: '63.0'
  },{
    browserName: 'safari',
    platform: 'macOS 10.13',
    version: '11.1'
  },{
    browserName: 'internet explorer',
    platform: 'Windows 10',
    version: '10.0'
  }]
}

// Code to support common capabilities
exports.config.capabilities.forEach(function(caps){
  for(var i in exports.config.commonCapabilities) caps[i] = caps[i] || exports.config.commonCapabilities[i];
});

