var nodeAssert = require('assert');
var assert = require('../../../../index.js');

var errorMessageString = 'cucumber-assert error message';
var errorMessageError = new Error(errorMessageString);

module.exports = function () {
	var errorsEncountered;

	var createAssertErrorMessage = function(callback) {
		return function(error) {
			nodeAssert.deepEqual(error, errorMessageError);
			errorsEncountered++;
			callback();
		};
	};

	this.Before(function() {
		errorsEncountered = 0;
	});

	this.Given(/^I run the cucumber suits$/, function (callback) {
		callback();
	});

	this.When(/^I fail an assert$/, function (callback) {
		assert.equal(true, false, createAssertErrorMessage(callback), errorMessageString);
	});

	this.When(/^I fail a throws$/, function (callback) {
		assert.throws(function() {}, createAssertErrorMessage(callback), errorMessageString);
	});

	this.When(/^I fail a doesNotThrow$/, function (callback) {
		assert.throws(function() { throw('up'); }, createAssertErrorMessage(callback), errorMessageString);
	});

	this.When(/^I fail a ifError$/, function (callback) {
		assert.ifError({}, createAssertErrorMessage(callback), errorMessageString);
	});

	this.When(/^I use multiple equals$/, function (callback) {
		assert.expectMultipleEquals(3, callback);
		assert.equal(true, true, null, errorMessageString);
		assert.equal(true, true, null, errorMessageString);
		assert.equal(true, true, null, errorMessageString);
	});

	this.When(/^I fail multiple equals$/, function (callback) {
		assert.expectMultipleEquals(3, createAssertErrorMessage(callback));
		assert.equal(true, true, null, errorMessageString);
		assert.equal(true, true, null, errorMessageString);
		assert.equal(true, false, null, errorMessageString);
		callback();
	});

	this.Then(/^everything worked as expected$/, function (callback) {
		nodeAssert.equal(errorsEncountered, 5);
		callback();
	});
};