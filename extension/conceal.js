/**
 * Conceal Passwords - Password Peek Chrome Extension
 *
 * Revert revealed password fields from input[type=text] to input[type=password]
 *
 * @version 0.9
 * @author 	Jason Gardner <@JasonGardner>
 * @link 	http://jasongardner.co/password-peek
 * @License http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 */


/**
 * Collection of password fields that have been revealed by the extension
 * @type {array}
 */
var passwords = document.querySelectorAll('input[type=text][data-password-revealed=true]');


// Loop through password fields
for (var i = 0, j = passwords.length; i < j; i++) {
	passwords[i].setAttribute('type', 'password'); // Reset input to type=password
	passwords[i].removeAttribute('data-password-revealed'); // Remove data- attribute added by the extension
}

//@ sourceURL=conceal.js