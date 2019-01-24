let myStr = process.env.LT_BROWSERS;
myStr = myStr.replace(/operatingSystem/g, 'platform');
myStr = myStr.replace(/browserVersion/g, 'version');
myStr = myStr.replace(/resolution/g, 'screen_resolution');
console.log(myStr);

const fs = require('fs');
let jsonData = JSON.parse(myStr);

exports.config = {
  user: process.env.LT_USERNAME,
  key: process.env.LT_ACCESS_KEY,
  server: 'hub.lambdatest.com',

  commonCapabilities: {
    name: "parallel_test",
    build: "cucumber-js-LambdaTest-parallel",
    'video': true,
    'network': true,
    'console': true,
    'visual': true,
  },

  capabilities: jsonData,
}

// Code to support common capabilities
exports.config.capabilities.forEach(function(caps){
  for(var i in exports.config.commonCapabilities) caps[i] = caps[i] || exports.config.commonCapabilities[i];
});

