var events = {
    domList: {},
    directList: {},

    /**
     * Triger event
     *
     * @param {string}  eventName
     * @param {string}  selector   (optional) CSS-selector of the DOM element
     *                             dispatching event. If not present it's
     *                             document
     * @param {object}  data       (optional) JSON sent as a detail with the
     *                             event
     */
	trigger: function(eventName, selector, data) {
        var elements, details;

        // Dealing with the optional arguments
        if (arguments.length === 3) {
            if (typeof selector === 'object') {
                elements = (selector.length)? selector : [selector];
            } else {
                elements = document.querySelectorAll(selector);
            }
            details = data;
        } else {
            elements = [document];
            details = (arguments.length === 2)? selector : null;
            selector = 'document';
        }
        
        // If the event is in the list of domless events,
        // then just trigger all the callbacks for all selectors
        var descriptor = eventName + ': ' + selector;
        if (events.directList[descriptor]) {
            var callbacks = events.directList[descriptor]
            for (var i = 0, leni = callbacks.length; i < leni; i++) {
                for (var j = 0, lenj = elements.length; j < lenj; j++) {
                    // Trying to emulate the event object
                    callbacks[i].call(elements[j], {
                        target: elements[j],
                        detail: details
                    });
                }
            }
            return;
        }

        // if it's DOM or custom event, we create the event first...
        var event;
        if (details) {
            event = new CustomEvent(eventName, { detail: details });
        } else {
            event = new Event(eventName);
        }
        
        // ... then dispatch it
        for (var i = 0, leni = elements.length; i < leni; i++) {
            elements[i].dispatchEvent(event);
        }
	},

	/**
	 * Handle DOM or custom event
	 * Passes the click right way, so popup blockers are working after that
	 *
	 * @param {string}    eventName
	 * @param {string}    selector   (optional) CSS-selector of the DOM element
	 *                               listening for event. If not present it's
	 *                               document.
	 * @param {function}  callback
	 * @param {boolean}   domless    (optional) Callback is called not trough
	 *                               DOM event, but as direct function call.
	 *                               So we can pass click event trough the
	 *                               event chain... and it's a little faster
	 */
	handle: function(eventName, selector, callback, domless) {
	    var elements, callbackFn, notDomEvent

        // Dealing with optional arguments
        if (typeof selector === 'function') {
            // there isn't custom selector, so we're handling event at document level
            elements = [document];
            callbackFn = selector;
            notDomEvent = callback;
            selector = 'document';
        } else {
            if (typeof selector === 'object') {
            	// selector is object – either nodelist or single element
            	if (selector.tagName || typeof selector.length !== 'number') {
            		// wrapping single element in an array for common cycle
	                elements = [selector];
	            } else {
            		// probably a node list
	            	elements = selector;
            	}
            } else {
            	// if it's not an object, it's probably a string
                elements = document.querySelectorAll(selector);
            }
            callbackFn = callback;
            notDomEvent = domless;
        }

        // Cache fn pointers to call them directly or remove them
        var descriptor = eventName + ': ' + selector;
        var list = (domless)? events.directList : events.domList;
        if (!list[descriptor]) {
            list[descriptor] = [];
        }
        list[descriptor].push(callback);

        // Attach dom event handlers
        for (var i = 0, leni = elements.length; i < leni; i++) {
            elements[i].addEventListener(eventName, callbackFn);
        }
	},
	
	
	/**
	 * Removes event handle
	 * 
	 * @param {string}    eventName
	 * @param {string}    selector   (optional) CSS-selector of the DOM element
	 *                               listening for event. If not present it's
	 *                               document.
	 * @param {function}  callback   (optional) if not present, all handles are
	 *                               removed
	 */
	removeHandle: function(eventName, selector, callback) {
	    
	}
}
