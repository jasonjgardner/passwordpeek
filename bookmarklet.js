/**
 * Reveal Password Bookmarklet
 *
 * @author   Jason Gardner <im@jasongardner.co>
 * @link     http://www.passwordpeek.com
 */
(function () {
    'use strict';

    var sticky = false, // True = click and hold to reveal. False = hover mouse to reveal.
        old = document.getElementsByClassName('_passwordPeek'), // Find any existing icons from bookmarklet
        concealTimer = (60 * 1000), // Amount of time the password will be revealed
        concealTimeout,
        passwords = [],
        inputs;
        
    /* Find all password fields on the page */

    if (!document.querySelectorAll) { // Old browsers
        // Find all inputs and pick out the [type="password"]
        inputs = document.getElementsByTagName('input'); // Find every input

        for (var a = 0, b = inputs.length; a < b; a++) {
            if (inputs[a].type.toLowerCase() === 'password') {
                passwords.push(inputs[a]);
            }
        }
    } else {
        passwords = document.querySelectorAll('input[type="password"]');
    }

    // Exit if function is not applicable to the page
    if (passwords.length <= 0) {
        alert('There are no passwords to reveal on this page!');
        return false;
    }

    /**
     * Find Position
     *
     * @author  Peter-Paul Koch (quirksmode.org)
     * @link    http://www.quirksmode.org/js/findpos.html
     * @param   {Object}    obj HTML element object
     * @return  {Array}         Array containing x,Y coordinates of the object
     */
    function findPos(obj) {
        var curleft = 0,
            curtop = 0;

        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
        }

        return [curleft, curtop];
    }

    /**
     * Button object positioned next to password inputs
     * Reveals the value of those inputs on mouse over
     * 
     * @param	{Object}	input	HTML <input type="password"> element
     * @return	{Object}			Reveal button
     */
    function Icon(input) {
        var icon = document.createElement('img'),
            iconURI = 'data:image/gif;base64,R0lGODlhIAAgALMAAPv7+9rZ2sDCwPb19jY1NhQUFAUFBVJYUoaMhhcbF+vq66erp3NxcwwMDAAAAP///yH5BAAAAAAALAAAAAAgACAAAARw8MlJq7046827/2AojmRpnmiqcgCgIMfBBG0JCIWj780CkIydcEcQARA7AyFGMBB/n8CuMHgEAo9BTrf4ALaGgVZXCIwdDShHqkN8hQUA24HwKAT46tDxuOEVJHsqBEIJK00ORSuLjI2Oj5CRkpMiEQA7', // Data URI for normal icon
            pos = findPos(input);

        // Icon attributes
        icon.src = iconURI;
        icon.height = 32;
        icon.width = 32;
        icon.setAttribute('class', '_passwordPeek');
        icon.setAttribute('title', '(Click to show/hide. Double click to remove.)');

        // Icon styles
        icon.style.border = '1px solid #bababa';
        //icon.style.boxShadow = '0px 2px 8px #e6e6e6'; // I think box shadows look pretty, but are not very metro. Your call.
        icon.style.cursor = 'pointer';

        // Icon positioning
        icon.style.position = 'absolute';
        icon.style.left = (pos[0] + input.offsetWidth) + 'px';
        icon.style.top = Math.round((input.offsetHeight - icon.height) / 2) + pos[1] + 'px';
        icon.style.zIndex = 500;
        //icon.style.marginLeft = '-2px'; // I think a bit of overlap looks nice, but it could obstruct the password field. Also your call.

        // Actions
        function show() { // Show password and change icon to hover state
            input.setAttribute('type', 'text');
            icon.src = 'data:image/gif;base64,R0lGODlhIAAgALMAADk8OYSChGtta83Ozefn5726vaWipVJVUvf39+fj562ure/v75SSlN7b3v///yEgISH5BAAAAAAALAAAAAAgACAAAASa0MlJq7046/26/2AoUmJpfuSphunqPu2rxrJJ1+OEz/pu96aDoVBQCHgSUyBhWTB+SZFCMyjdHoYJYkAcICZVFtAjmBAAD8ERQJg8QTemAwFgSwgCu2MhjpInBg9yd2mAcGMPBwGLaBYHD4sBjyiIfRNoUA4qAxQNSJonAF4OA5iZPqeoOX6qlKytHVeqsqi0PrY7G7q7vL0OEQA7'; // Data URI for hover icon

            // Password will be automatically concealed after a certain time
            concealTimeout = setTimeout(hide, concealTimer);
        }

        function hide() { // Hide password and revert icon to normal state
            input.setAttribute('type', 'password');
            icon.src = iconURI;

            clearTimeout(concealTimeout);
        }

        // Events
        if (sticky) { // Click and hold to reveal password. (More like Windows 8)
            icon.onmousedown = show;
            icon.onmouseup = hide;
        } else { // Mouse over to reveal password. (More mouse & keyboard friednly, in my opinion)
            icon.onmouseover = show;
            icon.onmouseout = hide;

            icon.onclick = function () { // Toggle visibility
                icon.onmouseout = (icon.onmouseout) ? null : hide;
            };
        }

        input.onblur = hide; // Revert when password input is blurred

        icon.ondblclick = function () { // Remove icon on double click
            hide();
            icon.parentNode.removeChild(icon);
        };

        return icon;
    }

    /* Dispatch reveal buttons */
    
    for (var c = 0, d = old.length; c < d; c++) { // Remove old icons
        old[c].parentNode.removeChild(old[c]);
    }

    for (var i = 0, j = passwords.length; i < j; i++) { // Insert icons next to password fields
        document.body.appendChild(new Icon(passwords[i]));
    }
})();