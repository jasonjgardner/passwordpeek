/**
 * Reveal Passwords - Password Peek Chrome Extension
 *
 * Convert password fields from input[type=password] to input[type=text]
 *
 * @version 0.9
 * @author	Jason Gardner <@JasonGardner>
 * @link	http://jasongardner.co/password-peek
 * @License http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 */


/**
 * Extension messaging connection
 * @type {object}
 */
var port = chrome.extension.connect({ name: 'PasswordPeek' }),

/**
 * Collection of password fields in the document
 * @type {array}
 */
	passwords = document.querySelectorAll('input[type=password]'),

/**
 * Milliseconds to wait before automatically concealing password text
 * @type {[type]}
 */
	concealTimer = (60 * 1000),

/**
 * Timeout function to automatically conceal passwords
 */
	concealTimeout;


/**
 * Sends a command to the extension and removes the event listener that called the function
 * @return {void}
 */
function blurConceal () {
	port.postMessage({ action: 'conceal' }); // Tell tab's Peeker to conceal passwords

	this.removeEventListener('blur', blurConceal); // Clean-up event listener to avoid interference with the page functions or scripts

	clearTimeout(concealTimeout);
}


// Loop through password fields
for (var i = 0, j = passwords.length; i < j; i++) {
	passwords[i].setAttribute('type', 'text'); // Set password input to plain text
	passwords[i].setAttribute('data-password-revealed', 'true'); // Flag field as modified by the extension

	passwords[i].addEventListener('blur', blurConceal, false); // Auto conceal this field on blur
}

// Auto blur
concealTimeout = setTimeout(function() {
	var event = new CustomEvent('blur', {'detail': {'timeout': true}});

	for (var i = 0, j = passwords.length; i < j; i++) {
		passwords[i].dispatchEvent(event);
	}

}, concealTimer);

//@ sourceURL=reveal.js