/**
 * Password Peek Chrome Extension
 *
 * Temporarily enables the user to see the contents of a password field.
 *
 * @version 0.9
 * @author	Jason Gardner <@JasonGardner>
 * @link	http://jasongardner.co/password-peek
 * @License http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 */



// Global variables //

/**
 * List of pages currently using the extension. Array keys are tab IDs, their values are Peeker objects.
 * @type {array}
 */
var pages = [];



// Global functions + classes //

/**
 * Update Browser Action icon
 * @param  {string} action
 * @return {void}
 */
function updateBrowserAction (action) {
	chrome.browserAction.setIcon({
		path: 'icons/' + action + '.png'
	});

	chrome.browserAction.setTitle({
		title: 'Click to ' + action + ' passwords'
	});
}


/**
 * Controls a tab's password fields' concealment
 * @param {int} id	Tab ID
 * @return {bool} Returns FALSE on failure
 */
function Peeker (id) {

	if (typeof id === 'undefined') { // Tab ID is required. Stop function if it's not passed.
		return false;
	}


	// Members //

	/**
	 * Reference to Peeker object, accessible within the methods' closures
	 * @type {object}
	 */
	var that = this;

	/**
	 * Tab ID
	 * @type {int}
	 */
	this.id = id; // Tab ID
	this.revealed = false; // 


	// Methods //

	/**
	 * Executes script to reveal contents of password fields
	 * @return {void}
	 */
	this.reveal = function() {
		chrome.tabs.executeScript(id, { file: 'reveal.js' }, function () { // Run reveal script
			updateBrowserAction('conceal'); // Change icon to reflect the next action to take

			that.revealed = true; // Passwords are now exposed
		});
	};


	/**
	 * Executes script to revert revealed fields back to concealed password fields
	 * @return {[type]}
	 */
	this.conceal = function() {
		chrome.tabs.executeScript(id, { file: 'conceal.js' }, function () { // Run conceal script
			updateBrowserAction('reveal'); // Change icon to reflect the next action to take

			that.revealed = false; // Passwords are now hidden
		});
	};


	/**
	 * Determine which method to run, based on if the object is activated
	 * @return {void}
	 */
	this.toggle = function() {
		if(that.revealed) {
			that.conceal();
		}
		else {
			that.reveal();
		}
	};

}



// Chrome Functions //

/**
 * Toggles visibility of password field content
 * @param  {object}
 * @return {void}
 */
chrome.browserAction.onClicked.addListener(function (tab) {

	// Create Peeker for page if not already set
	if(!pages[ tab.id ]) {
		pages[ tab.id ] = new Peeker (tab.id);
	}

	pages[tab.id].toggle();

});


/**
 * Monitor and execute Peeker commands received from the page
 * @param  {object} port Extension listener connection
 * @return {void}
 */
chrome.extension.onConnect.addListener(function (port) { // Create message connection
	console.assert(port.name == 'PasswordPeek');
  	
	port.onMessage.addListener(function (msg) {

		chrome.windows.getCurrent(function (currentWindow) { // Find the active tab in the current window
		    chrome.tabs.query({ active: true, windowId: currentWindow.id }, function (tabs) {
		    	
		    	if(!pages[ tabs[0].id ]) { // Stop function if the active tab doesn't have a Peeker object
					return false;
				}

				// Execute functions for specific commands
		    	if(msg.action == 'reveal') {
					pages[ tabs[0].id ].reveal();
				}
				else if(msg.action == 'conceal') {
					pages[ tabs[0].id ].conceal();
				}

		    }); // end query
		}); // end getCurrent

	}); // end addListener
});


/**
 * Updates icon when switching tabs
 * @param  {int} tabId
 * @param  {object}
 * @return {void}
 */
chrome.tabs.onActiveChanged.addListener(function (tabId, info) {
	// Update icon to represent the current state of the page's peeker
	updateBrowserAction( (pages[ tabId ] && pages[ tabId ].revealed) ? 'conceal' : 'reveal' );
});


/**
 * Undo Peeker changes when a tab is updated
 * @param  {int} tabId
 * @param  {object} change
 * @param  {object} tab
 * @return {void}
 */
chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {

	if(pages[ tabId ]) { // Check for this tab's Peeker
		
		// Revert password fields back to normal
		pages[ tabId ].conceal();

		// Remove Peeker object for this tab
		pages.splice(tabId, 1);
	}

});