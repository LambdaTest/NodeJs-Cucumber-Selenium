# NodeJs-Cucumber-Selenium-Sample

Node.js is an efficient, light weight and cross platform runtime environment for executing JavaScript code. npm(node package manager) is the largest ecosystem of open source libraries. LambdaTest enables node.js scripts to run on the Selenium automation grid. This tutorial will help you run Nodejs automation scripts over LambdaTest Selenium Grid.

## Prerequisites

1. Install npm.

```
sudo apt install npm
```

2. Install NodeJS.

```
sudo apt install nodejs
```

## Steps to Run your First Test

Step 1. Clone the NodeJs Cucumber Selenium Repository.

```
git clone https://github.com/LambdaTest/NodeJs-Cucumber-Selenium.git
```

Step 2. Export the Lambda-test Credentials. You can get these from your automation dashboard.

<p align="center">
   <b>For Linux/macOS:</b>:
 
```
export LT_USERNAME="YOUR_USERNAME"
export LT_ACCESS_KEY="YOUR ACCESS KEY"
```
<p align="center">
   <b>For Windows:</b>

```
set LT_USERNAME="YOUR_USERNAME"
set LT_ACCESS_KEY="YOUR ACCESS KEY"
```

Step 3. Inside Nodejs.Ccumber.Selenium repository install necessary packages.

```
cd NodeJs-Cucumber-Selenium
npm i
```

Step 4. To run your First Test.

```
npm run single
```

Step 5. To run parallel Test.

```
npm run parallel
```

Step 6. To run your test locally.

```
npm run local
```

Step 7. Or, you can run all three test.

```
npm run test
```

## See the Results

You can check your test results on the [Automation Dashboard](https://automation.lambdatest.com/build).
![Automation Testing Logs](https://github.com/LambdaTest/NodeJs-Cucumber-Selenium/dashboard.png)

## About LambdaTest

[LambdaTest](https://www.lambdatest.com/) is a cloud based Selenium Grid Infrastructure that can help you run automated cross browser compatibility tests on 2000+ different browser and operating system environments. LambdaTest supports all programming languages and frameworks that are supported with Selenium, and have easy integrations with all popular CI/CD platforms. It's a perfect solution to bring your [Selenium test automation](https://www.lambdatest.com/selenium-automation) to cloud based infrastructure that not only helps you increase your test coverage over multiple desktop and mobile browsers, but also allows you to cut down your test execution time by running tests on parallel.
