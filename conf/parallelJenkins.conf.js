import fs from 'fs';

// Process and transform environment variable
let myStr = process.env.LT_BROWSERS || '[]';
myStr = myStr
  .replace(/operatingSystem/g, 'platform')
  .replace(/browserVersion/g, 'version')
  .replace(/resolution/g, 'screen_resolution');

console.log(myStr);

let jsonData;
try {
  jsonData = JSON.parse(myStr);
} catch (err) {
  console.error('Error parsing LT_BROWSERS JSON:', err);
  jsonData = [];
}

export const config = {
  user: process.env.LT_USERNAME || '<YOUR LAMBDATEST USERNAME>',
  key: process.env.LT_ACCESS_KEY || '<YOUR LAMBDATEST KEY>',
  server: 'hub.lambdatest.com',

  commonCapabilities: {
    name: 'parallel_cucumber-js-LambdaTest-parallel-tests',
    build: 'cucumber-js-LambdaTest-parallel',
  },

  capabilities: jsonData,
};

// Apply common capabilities to each capability
config.capabilities.forEach((caps) => {
  for (const key in config.commonCapabilities) {
    caps[key] = caps[key] || config.commonCapabilities[key];
  }
});
