events.js
=========
“Every developer must create his own event manager”

Simple events manager that gives you the ability:
  - to attach event handlers to any element with document by default;
  - to trigger events with custom data (via detail param);
  - to emulate triggering the DOM event calling the saved function to solve some problems with popup blockers.

ToDo:
  - removing handles.


Usage
-----
include events.js in your html-page:

  <script type="text/javascript" src="event.js"></script>


Attach event listener to all <button> elements on a page:

  events.handle('click', 'button', callbackFn);


Attach event listener to the document:

  events.handle('my-custom-event', callbackFn);


Trigger custom events with additional data:

  events.trigger('my-custom-event', { 'user-id': 123, 'age': 12 });
