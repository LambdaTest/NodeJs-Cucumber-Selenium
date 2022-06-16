# Run Selenium Tests With Cucumber for BDD On LambdaTest

![JavaScript](https://user-images.githubusercontent.com/95698164/172134732-2e9c780e-10ac-4956-b366-86ffc25bf070.png)

<p align="center">
  <a href="https://www.lambdatest.com/blog/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium" target="_bank">Blog</a>
  &nbsp; &#8901; &nbsp;
  <a href="https://www.lambdatest.com/support/docs/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium" target="_bank">Docs</a>
  &nbsp; &#8901; &nbsp;
  <a href="https://www.lambdatest.com/learning-hub/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium" target="_bank">Learning Hub</a>
  &nbsp; &#8901; &nbsp;
  <a href="https://www.lambdatest.com/newsletter/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium" target="_bank">Newsletter</a>
  &nbsp; &#8901; &nbsp;
  <a href="https://www.lambdatest.com/certifications/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium" target="_bank">Certifications</a>
  &nbsp; &#8901; &nbsp;
  <a href="https://www.youtube.com/c/LambdaTest" target="_bank">YouTube</a>
</p>
&emsp;
&emsp;
&emsp;

*Learn how to use Cucumber for BDD framework to configure and run your JavaScript automation testing scripts on the LambdaTest platform*

[<img height="58" width="200" src="https://user-images.githubusercontent.com/70570645/171866795-52c11b49-0728-4229-b073-4b704209ddde.png">](https://accounts.lambdatest.com/register)

## Table Of Contents

* [Pre-requisites](#pre-requisites)
* [Run Your First Test](#run-your-first-test)
* [Running Your Parallel Tests Using Cucumber Framework](#running-your-parallel-tests-using-cucumber-framework)
* [Testing Locally Hosted or Privatley Hosted Projects](#testing-locally-hosted-or-privately-hosted-projects)

## Pre-requisites 

Before getting started with Selenium automation testing on LambdaTest, you need to:

* Download and install **NodeJS**. You should be having **NodeJS v6** or newer. Click [here](https://nodejs.org/en/) to download.
* Make sure you are using the latest version of **JavaScript**.
* Install **npm** from the official website by clicking [here](https://www.npmjs.com/).
* Download [Selenium JavaScript bindings](https://www.selenium.dev/downloads/) from the official website. Latest versions of **Selenium Client** and **WebDriver** are ideal for running your JavaScript automation testing script on LambdaTest’s Selenium Grid.

### Installing Selenium Dependencies and tutorial repo

Clone the LambdaTest’s [NodeJs-Cucumber-Selenium repository](https://github.com/LambdaTest/NodeJs-Cucumber-Selenium) and navigate to the code directory as shown below:
```bash
git clone https://github.com/LambdaTest/NodeJs-Cucumber-Selenium
cd NodeJs-Cucumber-Selenium
```
Install the required project dependencies using the command below:
```bash
npm install
```

### Setting up Your Authentication
Make sure you have your LambdaTest credentials with you to run test automation scripts on LambdaTest Selenium Grid. You can obtain these credentials from the [LambdaTest Automation Dashboard](https://automation.lambdatest.com/build/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium) or through [LambdaTest Profile](https://accounts.lambdatest.com/login/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium).

Set LambdaTest `Username` and `Access Key` in environment variables.
  * For **Linux/macOS**:
  ```bash
  export LT_USERNAME="YOUR_USERNAME" export LT_ACCESS_KEY="YOUR ACCESS KEY"
  ```
  * For **Windows**:
  ```bash
  $env:LT_USERNAME='YOUR USERNAME'
  $env:LT_ACCESS_KEY='YOUR ACCESS KEY'
  ```

## Run Your First Test

### Sample Test with CucumberJS
The example mentioned below would help you to execute your **Cucumber JS** Testing automation testing-
```bash
//nodejs-cucumber-todo/features/todo.feature
Feature: Automate a website
    Scenario: perform click events
      When visit url "https://lambdatest.github.io/sample-todo-app"
      When field with name "First Item" is present check the box
      When field with name "Second Item" is present check the box
      When select the textbox add "Let's add new to do item" in the box
      Then click the "addbutton"
      Then I must see title "Sample page - lambdatest.com"
```
Now create `step definition` file.
```js
//nodejs-cucumber-todo/features/step_definitions/todo.js
/*
This file contains the code which automate the sample app.
It reads instructions form feature file and find matching
case and execute it.
*/
 
 
'use strict';
 
const assert = require('cucumber-assert');
const webdriver = require('selenium-webdriver');
 
module.exports = function() {
 
  this.When(/^visit url "([^"]*)"$/, function (url, next) {
    this.driver.get('https://lambdatest.github.io/sample-todo-app').then(next);
  });
 
  this.When(/^field with name "First Item" is present check the box$/, function (next) {
      this.driver.findElement({ name: 'li1' })
      .click().then(next);
  });
 
  this.When(/^field with name "Second Item" is present check the box$/, function (next) {
      this.driver.findElement({ name: 'li3' })
      .click().then(next);
  });
 
  this.When(/^select the textbox add "([^"]*)" in the box$/, function (text, next) {
      this.driver.findElement({ id: 'sampletodotext' }).click();
      this.driver.findElement({ id: 'sampletodotext' }).sendKeys(text).then(next);
  });
 
  this.Then(/^click the "([^"]*)"$/, function (button, next) {
    this.driver.findElement({ id: button }).click().then(next);
  });
 
  this.Then(/^I must see title "([^"]*)"$/, function (titleMatch, next) {
    this.driver.getTitle()
      .then(function(title) {
        assert.equal(title, titleMatch, next, 'Expected title to be ' + titleMatch);
      });
  });
};
```
Now create `cucumber js` framework `runner` file.
```js
//nodejs-cucumber-todo/scripts/cucumber-runner.js
#!/usr/bin/env node
/*
This is parallel test runner file.
It creates child processes equals the number of
test environments passed.
*/
let child_process = require('child_process');
let config_file = '../conf/' + (process.env.CONFIG_FILE || 'single') + '.conf.js';
let config = require(config_file).config;
 
process.argv[0] = 'node';
process.argv[1] = './node_modules/.bin/cucumber-js';
 
const getValidJson = function(jenkinsInput) {
    let json = jenkinsInput;
    json = json.replace(/\\n/g, "");
    json = json.replace('\\/g', '');
    return json;
};
 
let lt_browsers = null;
if(process.env.LT_BROWSERS) {
    let jsonInput = getValidJson(process.env.LT_BROWSERS);
    lt_browsers = JSON.parse(jsonInput);
}
 
for( let i in (lt_browsers || config.capabilities) ){
  let env = Object.create( process.env );
  env.TASK_ID = i.toString();
  let p = child_process.spawn('/usr/bin/env', process.argv, { env: env } ); 
  p.stdout.pipe(process.stdout);
}
```

### Configuration of Your Test Capabilities
In `conf/single.conf.js`  file, you need to update your test capabilities. In this code, we are passing browser, browser version, and operating system information, along with LambdaTest Selenium grid capabilities via capabilities object. The capabilities object in the above code are defined as:
```js
 capabilities: [{
    browserName: 'chrome',
    platform: 'Windows 10',
    version: 'latest',
    name: "cucumber-js-single-test",
    build: "cucumber-js-LambdaTest-single"
  }]
```
> You can generate capabilities for your test requirements with the help of our inbuilt **[Capabilities Generator tool](https://www.lambdatest.com/capabilities-generator/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium)**.

### Executing the Test

The tests can be executed in the terminal using the following command
```bash
npm run single
```
Your test results would be displayed on the test console (or command-line interface if you are using terminal/cmd) and on [LambdaTest automation dashboard](https://automation.lambdatest.com/build/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium). LambdaTest Automation Dashboard will help you view all your text logs, screenshots and video recording for your entire automation tests.

## Running Your Parallel Tests Using Cucumber Framework

### Executing Parallel Tests with Cucumber

To run parallel tests using **CucumberJS**, we would have to execute the below command in the terminal:
```bash
npm run parallel
```
Your test results would be displayed on the test console (or command-line interface if you are using terminal/cmd) and on [LambdaTest automation dashboard](https://automation.lambdatest.com/build/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium).

## Testing Locally Hosted or Privately Hosted Projects

You can test your locally hosted or privately hosted projects with [LambdaTest Selenium grid cloud](https://www.lambdatest.com/selenium-automation/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium) using LambdaTest Tunnel app. All you would have to do is set up an SSH tunnel using LambdaTest Tunnel app and pass toggle `tunnel = True` via desired capabilities. LambdaTest Tunnel establishes a secure SSH protocol based tunnel that allows you in testing your locally hosted or privately hosted pages, even before they are made live.

>Refer our [LambdaTest Tunnel documentation](https://www.lambdatest.com/support/docs/testing-locally-hosted-pages/) for more information.

Here’s how you can establish LambdaTest Tunnel.

>Download the binary file of:
* [LambdaTest Tunnel for Windows](https://downloads.lambdatest.com/tunnel/v3/windows/64bit/LT_Windows.zip)
* [LambdaTest Tunnel for Mac](https://downloads.lambdatest.com/tunnel/v3/mac/64bit/LT_Mac.zip)
* [LambdaTest Tunnel for Linux](https://downloads.lambdatest.com/tunnel/v3/linux/64bit/LT_Linux.zip)

Open command prompt and navigate to the binary folder.

Run the following command:
```bash
LT -user {user’s login email} -key {user’s access key}
```
So if your user name is lambdatest@example.com and key is 123456, the command would be:
```bash
LT -user lambdatest@example.com -key 123456
```
Once you are able to connect **LambdaTest Tunnel** successfully, you would just have to pass on tunnel capabilities in the code shown below :

**Tunnel Capability**
```js
const capabilities = {
        tunnel: true,
}
```
### Executing the local tests
To run local tests using **CucumberJS**, we would have to execute the below command in the terminal:
```bash
npm run local
```

## Executing all the tests 
To run all the tests at once using **CucumberJS**, we would have to execute the below command in the terminal:

```bash
npm run test
```

>If you wish to set up your CucumberJS testing through Jenkins, then refer to our [Jenkins documentation](https://www.lambdatest.com/support/docs/jenkins-with-lambdatest/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium).


## Additional Links

* [Advanced Configuration for Capabilities](https://www.lambdatest.com/support/docs/selenium-automation-capabilities/)
* [How to test locally hosted apps](https://www.lambdatest.com/support/docs/testing-locally-hosted-pages/)
* [How to integrate LambdaTest with CI/CD](https://www.lambdatest.com/support/docs/integrations-with-ci-cd-tools/)

## Tutorials 📙

Check out our latest tutorials on TestNG automation testing 👇

* [How To Perform Automation Testing With Cucumber And Nightwatch JS?](https://www.lambdatest.com/blog/automation-testing-with-cucumber-and-nightwatchjs/#Cucumberjs/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium)
* [Configure Cucumber Setup In Eclipse And IntelliJ [Tutorial]](https://www.lambdatest.com/blog/configure-cucumber-setup-in-eclipse-and-intellij/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium)
* [Cucumber.js Tutorial with Examples For Selenium JavaScript](https://www.lambdatest.com/blog/cucumberjs-tutorial-selenium/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium)
* [How To Use Annotations In Cucumber Framework [Tutorial]](https://www.lambdatest.com/blog/cucumber-annotations-hooks-tutorial/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium)
* [How To Perform Automation Testing With Cucumber And Nightwatch JS?](https://www.lambdatest.com/blog/automation-testing-with-cucumber-and-nightwatchjs/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium)
* [Automation Testing With Selenium, Cucumber & TestNG](https://www.lambdatest.com/blog/automation-testing-with-selenium-cucumber-testng/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium)
* [How To Integrate Cucumber With Jenkins?](https://www.lambdatest.com/blog/cucumber-with-jenkins-integration/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium)
* [Top 5 Cucumber Best Practices For Selenium Automation](https://www.lambdatest.com/blog/cucumber-best-practices/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium)

## Documentation & Resources :books:
 
Visit the following links to learn more about LambdaTest's features, setup and tutorials around test automation, mobile app testing, responsive testing, and manual testing.

* [LambdaTest Documentation](https://www.lambdatest.com/support/docs/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium)
* [LambdaTest Blog](https://www.lambdatest.com/blog/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium)
* [LambdaTest Learning Hub](https://www.lambdatest.com/learning-hub/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium)    

## LambdaTest Community :busts_in_silhouette:

The [LambdaTest Community](https://community.lambdatest.com/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium) allows people to interact with tech enthusiasts. Connect, ask questions, and learn from tech-savvy people. Discuss best practises in web development, testing, and DevOps with professionals from across the globe 🌎

## What's New At LambdaTest ❓

To stay updated with the latest features and product add-ons, visit [Changelog](https://changelog.lambdatest.com/) 
      
## About LambdaTest

[LambdaTest](https://www.lambdatest.com/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium) is a leading test execution and orchestration platform that is fast, reliable, scalable, and secure. It allows users to run both manual and automated testing of web and mobile apps across 3000+ different browsers, operating systems, and real device combinations. Using LambdaTest, businesses can ensure quicker developer feedback and hence achieve faster go to market. Over 500 enterprises and 1 Million + users across 130+ countries rely on LambdaTest for their testing needs.    

### Features

* Run Selenium, Cypress, Puppeteer, Playwright, and Appium automation tests across 3000+ real desktop and mobile environments.
* Real-time cross browser testing on 3000+ environments.
* Test on Real device cloud
* Blazing fast test automation with HyperExecute
* Accelerate testing, shorten job times and get faster feedback on code changes with Test At Scale.
* Smart Visual Regression Testing on cloud
* 120+ third-party integrations with your favorite tool for CI/CD, Project Management, Codeless Automation, and more.
* Automated Screenshot testing across multiple browsers in a single click.
* Local testing of web and mobile apps.
* Online Accessibility Testing across 3000+ desktop and mobile browsers, browser versions, and operating systems.
* Geolocation testing of web and mobile apps across 53+ countries.
* LT Browser - for responsive testing across 50+ pre-installed mobile, tablets, desktop, and laptop viewports

    
[<img height="58" width="200" src="https://user-images.githubusercontent.com/70570645/171866795-52c11b49-0728-4229-b073-4b704209ddde.png">](https://accounts.lambdatest.com/register)
      
## We are here to help you :headphones:

* Got a query? we are available 24x7 to help. [Contact Us](support@lambdatest.com/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium)
* For more info, visit - [LambdaTest](https://www.lambdatest.com/?utm_source=github&utm_medium=repo&utm_campaign=NodeJs-Cucumber-Selenium)
