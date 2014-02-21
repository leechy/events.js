var events = {
    list: {},

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
            elements = document.querySelectorAll(selector);
            details = data;
        } else {
            elements = [document];
            details = (arguments.length === 2)? selector : null;
            selector = 'document';
        }
        
        // If the event is in the list of domless events,
        // then just trigger all the callbacks for all selectors
        if (events.list[eventName + ': ' + selector]) {
            var callbacks = events.list[eventName + selector]
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
            // there isn't custom selector
            elements = [document];
            callbackFn = selector;
            notDomEvent = callback;
            selector = 'document';
        } else {
            elements = document.querySelectorAll(selector);
            callbackFn = callback;
            notDomEvent = domless;
        }
        
        if (notDomEvent) {
            if (!events.list[eventName + ': ' + selector]) {
                events.list[eventName + ': ' + selector] = [];
            }
            events.list[eventName + ': ' + selector].push(callback);
        } else {
            for (var i = 0, leni = elements.length; i < leni; i++) {
                elements[i].addEventListener(eventName, callbackFn);
            }
        }
	},
	
	removeHandle: function() {
	    
	}
}
