cucumber-assert
===============
[![Build Status](https://travis-ci.org/djungowski/cucumber-assert.svg?branch=master)](https://travis-ci.org/djungowski/cucumber-assert)

An assertion library for [cucumber.js](https://github.com/cucumber/cucumber-js). It allows assertions in cucumber.js without extra-long stacktraces when an assertion fails.

## Note
As of version 1.0.2 only cucumber.js >= 0.7.0 is supported. If you are still using an older version of cucumber.js, please use version 1.0.1

## Installation
```bash
npm install cucumber-assert
```

## Example usage
```javascript
var assert = require('cucumber-assert');

module.exports = function() {

	this.Given(/^the field E-Mail is filled with "([^"]*)"/, function (email, callback) {
		var fieldValue = this.getFieldValue('#password');
		assert.equal(fieldValue, email, callback, 'Expected E-Mail to be ' + email);
	});

}
```

## Multiple operations
Generally I would advise you to use single steps for every assert operation. In case you want to do multiple equals/notEquals/etc. operations anyhow (ONLY works for equals operations!):
```javascript
var assert = require('cucumber-assert');

module.exports = function() {

	this.Given(/^the form is filled out"/, function (callback) {
		var password = this.getFieldValue('#password');
		var name = this.getFieldValue('#name');
		var tosCheck = this.getFieldValue('#tos');
		
		assert.expectMultipleEquals(3, callback);
		assert.notEqual(password, '', null, 'Expected E-Mail to not be empty');
		assert.notEqual(tosCheck, '', null, 'Expected Name not to be empty');
		assert.equal(tosCheck, 'checked', null, 'Expected TOS to be checked');
	});

}
```

## Available assertions
Generally cucumber-assert wraps the assertions available by default in node. For reference see http://nodejs.org/api/assert.html

The parameter "callback" is the callback provided by cucumber.js in step definitions and has to be passed always alongside the actual values and expectations.

#### equal(actual, expected, callback, [message])
#### notEqual(actual, expected, callback, [message])
#### deepEqual(actual, expected, callback, [message])
#### notDeepEqual(actual, expected, callback, [message])
#### strictEqual(actual, expected, callback, [message])
#### notStrictEqual(actual, expected, callback, [message])
#### throws(block, callback, [error], [message])
#### doesNotThrow(block, callback, [message])
#### ifError(value, callback, [message])

## Changelog
[See here](CHANGELOG.md)
