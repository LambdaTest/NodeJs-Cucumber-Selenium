"use strict";

var assert = require("cucumber-assert");

module.exports = function() {
  this.When(/^I click on first item on local app$/, function(next) {
    this.driver.get("https://lambdatest.github.io/sample-todo-app/");
    this.driver
      .findElement({ name: "li1" })
      .click()
      .then(next);
  });

  this.When(/^I click on second item on local app$/, function(next) {
    this.driver
      .findElement({ name: "li2" })
      .click()
      .then(next);
  });

  this.When(/^I add new item "([^"]*)" on local app$/, function(
    newItemName,
    next
  ) {
    var self = this;
    this.driver
      .findElement({ id: "sampletodotext" })
      .sendKeys(newItemName + "\n")
      .then(next);
    this.driver
      .findElement({ id: "addbutton" })
      .click()
      .then(next);
  });

  this.Then(/^I should see new item in list "([^"]*)" on local app$/, function(
    item,
    next
  ) {
    var self = this;
    this.driver
      .findElement({ xpath: "//html/body/div/div/div/ul/li[6]/span" })
      .getText()
      .then(function(text) {
        console.log(text);
        assert.equal(text, item, next, "Expected title to be " + item);
      });
  });
};
