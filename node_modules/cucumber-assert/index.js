var assert = require('assert');

var CucumberAssert = function() {

};

/**
 * Number of expected equals operations
 * @type {number}
 */
CucumberAssert.prototype.expectedEqualsOperations = 1;

/**
 * The cucumber callback. Only set if expectedEqualsOperations is > 1
 * @type {function}
 */
CucumberAssert.prototype.cucumberCallback = null;

/**
 * Call an actual "equals" assertion of the assert lib of node
 * See http://nodejs.org/api/assert.html for details
 *
 * @param method		The method to be called
 * @param actual		The actual value
 * @param expected		The expected value
 * @param callback		The cucumber.js callback
 * @param [message]		The error message (optional)
 */
CucumberAssert.prototype.callActualEqualAssert = function(method, actual, expected, callback, message) {

	callback = this.getCorrectCallback(callback);

	try {
		assert[method](actual, expected, message);

		if (this.expectedEqualsOperations == 1) {
			callback();
			this.resetCucumberCallback();
		} else {
			this.expectedEqualsOperations--;
		}
	} catch(e) {
		callback(new Error(e.message));
	}
};

/**
 * Tell cucumber-assert that there will be more than 1 equals operation
 *
 * @param amountOfOperations
 * @param callback
 */
CucumberAssert.prototype.expectMultipleEquals = function(amountOfOperations, callback) {
	this.expectedEqualsOperations = amountOfOperations;
	this.cucumberCallback = callback;
};

/**
 * Get the correct callback for a equals operation.
 * Will return this.cucumberCallback if set, otherwise the provided callback
 *
 * @param callback
 * @returns {function}
 */
CucumberAssert.prototype.getCorrectCallback = function(callback) {
	if (callback == null && this.cucumberCallback != null) {
		return this.cucumberCallback;
	}

	return callback;
};

/**
 * Reset any saved cucumber callback
 *
 */
CucumberAssert.prototype.resetCucumberCallback = function() {
	this.cucumberCallback = null;
};

/**
 * Wrapper for http://nodejs.org/api/assert.html#assert_assert_equal_actual_expected_message
 *
 * @param actual		The actual value
 * @param expected		The expected value
 * @param callback		The cucumber.js callback
 * @param [message]		The error message (optional)
 */
CucumberAssert.prototype.equal = function(actual, expected, callback, message) {
	this.callActualEqualAssert('equal', actual, expected, callback, message);
};

/**
 * Wrapper for http://nodejs.org/api/assert.html#assert_assert_notequal_actual_expected_message
 *
 * @param actual		The actual value
 * @param expected		The expected value
 * @param callback		The cucumber.js callback
 * @param [message]		The error message (optional)
 */
CucumberAssert.prototype.notEqual = function(actual, expected, callback, message) {
	this.callActualEqualAssert('notEqual', actual, expected, callback, message);
};

/**
 * Wrapper for http://nodejs.org/api/assert.html#assert_assert_deepequal_actual_expected_message
 *
 * @param actual		The actual value
 * @param expected		The expected value
 * @param callback		The cucumber.js callback
 * @param [message]		The error message (optional)
 */
CucumberAssert.prototype.deepEqual = function(actual, expected, callback, message) {
	this.callActualEqualAssert('deepEqual', actual, expected, callback, message);
};

/**
 * Wrapper for http://nodejs.org/api/assert.html#assert_assert_notdeepequal_actual_expected_message
 *
 * @param actual		The actual value
 * @param expected		The expected value
 * @param callback		The cucumber.js callback
 * @param [message]		The error message (optional)
 */
CucumberAssert.prototype.notDeepEqual = function(actual, expected, callback, message) {
	this.callActualEqualAssert('notDeepEqual', actual, expected, callback, message);
};

/**
 * Wrapper for http://nodejs.org/api/assert.html#assert_assert_strictequal_actual_expected_message
 *
 * @param actual		The actual value
 * @param expected		The expected value
 * @param callback		The cucumber.js callback
 * @param [message]		The error message (optional)
 */
CucumberAssert.prototype.strictEqual = function(actual, expected, callback, message) {
	this.callActualEqualAssert('strictEqual', actual, expected, callback, message);
};

/**
 * Wrapper for http://nodejs.org/api/assert.html#assert_assert_notstrictequal_actual_expected_message
 *
 * @param actual		The actual value
 * @param expected		The expected value
 * @param callback		The cucumber.js callback
 * @param [message]		The error message (optional)
 */
CucumberAssert.prototype.notStrictEqual = function(actual, expected, callback, message) {
	this.callActualEqualAssert('notStrictEqual', actual, expected, callback, message);
};

/**
 * Wrapper for http://nodejs.org/api/assert.html#assert_assert_throws_block_error_message
 *
 * @param block			The function to be executed
 * @param callback		The cucumber.js callback
 * @param [error]		The expected error (optional)
 * @param [message]		The error message (optional)
 */
CucumberAssert.prototype.throws = function(block, callback, error, message) {
	try {
		assert.throws(block, error, message);
		callback();
	} catch(e) {
		// For some reason with assert.throws, etc. the exception does not use the message provided
		message = message || e.message;
		callback(new Error(message));
	}
};

/**
 * Wrapper for http://nodejs.org/api/assert.html#assert_assert_doesnotthrow_block_message
 *
 * @param block			The function to be executed
 * @param callback		The cucumber.js callback
 * @param [message]		The error message (optional)
 */
CucumberAssert.prototype.doesNotThrow = function(block, callback, message) {
	try {
		assert.doesNotThrow(block, message);
		callback();
	} catch(e) {
		// For some reason with assert.doesNotThrow the exception message is undefined. Use a custom one
		// if no message is provided
		message = message || 'Caught exception where there was supposed to be none.';
		callback(new Error(message));
	}
};

/**
 * Wrapper for http://nodejs.org/api/assert.html#assert_assert_iferror_value
 *
 * @param value			The value to be tested
 * @param callback		The cucumber.js callback
 * @param [message]		The error message (optional)
 */
CucumberAssert.prototype.ifError = function(value, callback, message) {
	try {
		assert.ifError(value);
		callback();
	} catch(e) {
		message = message || 'Expected value to be false, true provided.';
		callback(new Error(message));
	}
};

module.exports = new CucumberAssert();