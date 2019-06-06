"use strict";

const webdriver = require("selenium-webdriver");
const lambdaTunnel = require("@lambdatest/node-tunnel");

const config_file =
  "../../conf/" + (process.env.CONFIG_FILE || "single") + ".conf.js";
const config = require(config_file).config;
const tunnelArguments = { user: config.user, key: config.key };

const myTunnel = new lambdaTunnel();

var createLambdaTestSession = function(config, caps) {
  console.log(
    "https://" +
      config.user +
      ":" +
      config.key +
      "@" +
      config.server +
      "/wd/hub"
  );
  return new webdriver.Builder()
    .usingServer(
      "https://" +
        config.user +
        ":" +
        config.key +
        "@" +
        config.server +
        "/wd/hub"
    )
    .withCapabilities(caps)
    .build();
};

var myHooks = function() {
  this.Before(function(scenario, callback) {
    var world = this;
    var task_id = parseInt(process.env.TASK_ID || 0);
    var caps = config.capabilities[task_id];

    if (caps["tunnel"]) {
      // Code to start browserstack local before start of test and stop browserstack local after end of test

      myTunnel.start(tunnelArguments, function(e, status) {
        if (e) return console.log(e);
        console.log("Started Tunnel " + status);
        console.log(
          "TUNNELLLLL" + caps["tunnel"] + caps["browserName"] + caps["build"]
        );
        world.driver = createLambdaTestSession(config, caps);
        callback();
      });
    } else {
      world.driver = createLambdaTestSession(config, caps);
      callback();
    }
  });

  console.log("TUNNEL STATUS" + myTunnel.isRunning());
  this.After(function(scenario, callback) {
    console.log("Started Tunnel AFTER " + myTunnel.isRunning());
    this.driver.quit().then(function() {
      if (myTunnel) {
        myTunnel.stop(callback);
      }
      callback();
    });
  });
};

module.exports = myHooks;
