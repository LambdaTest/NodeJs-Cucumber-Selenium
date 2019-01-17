'use strict';

var webdriver = require('selenium-webdriver');
//var lambdatest = require('lambdatest-local');

var config_file = '../../conf/' + (process.env.CONFIG_FILE || 'single') + '.conf.js';
var config = require(config_file).config;

var username = process.env.LT_USERNAME || config.user;
var accessKey = process.env.LT_APIKEY || config.key;

var createLambdaTestSession = function(config, caps){
  return new webdriver.Builder().
    usingServer('https://'+config.user+':'+config.key+'@'+config.server+'/wd/hub').
    withCapabilities(caps).
    build();
}

var myHooks = function () {
  var bs_local = null;

  this.Before(function (scenario, callback) {
    var world = this;
    var task_id = parseInt(process.env.TASK_ID || 0);
    var caps = config.capabilities[task_id];
    //caps['lambdatest.user'] = username;
    //caps['lmabdatest.key'] = accessKey;
    world.driver = createLambdaTestSession(config, caps);
    callback();
  
  });

  this.After(function(scenario, callback){
    this.driver.quit().then(function(){
      callback();
    });
  });
};

module.exports = myHooks;
