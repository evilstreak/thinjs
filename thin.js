// Thin JS. (C) 2009 Dominic Baggott. Released under MIT license
(function() {
  // help the minifier crush the code
  var doc = document,
  addEventListener = "addEventListener",
  querySelectorAll = "querySelectorAll",
  w3c = !!doc[ addEventListener ],

  // get the target of an event
  getTarget = function( event ) {
    event = event || window.event;
    return event.target || event.srcElement;
  },

  // add an event handler to an element
  addEvent = function( element, event, fn ) {
    if ( w3c ) {
      element[ addEventListener ]( event, fn, false );
    }
    else {
      element.attachEvent( 'on' + event, function( e ) {
        fn.call( getTarget( e ), e );
      } );
    }
  },

  /**
   *  $( selector )
   *  - selector (String|Node|NodeList): selector to use to find elements
   *
   *  Browsers which don't support document.querySelectorAll will always
   *  return an empty list.
   **/
  Thin = function( selector ) {
    // use an empty array to fail silently in unsupported browsers
    var elements = [];

    // a string is a selector
    if ( typeof selector === "string" ) {
      if ( doc[ querySelectorAll ] ) {
        elements = doc[ querySelectorAll ]( selector );
      }
    }
    // allows wrapping of single nodes
    else if ( selector.nodeType ) {
      elements = [ selector ];
    }
    // allows wrapping of NodeLists (including those returned by Thin)
    else if ( selector.length ) {
      elements = selector;
    }

    /**
     *  each( fn )
     *  - fn (Function): the function to call for each element
     **/
    elements.each = function( fn ) {
      for ( var i = 0; i < elements.length; i++ ) {
        fn.call( elements[ i ], i );
      }

      // return elements to allow chaining
      return elements;
    };

    /**
     *  bind( event, fn )
     *  - event (String): the name of the event, e.g. click, hover
     *  - fn (Function): the function to call when the event triggers
     **/
    elements.bind = function( event, fn ) {
      return elements.each( function() {
        addEvent( this, event, fn );
      } );
    };

    /**
     *  live( event, fn )
     *  - event (String): the name of the event, e.g. click, hover
     *  - fn (Function): the function to call when the event triggers
     **/
    elements.live = function( event, fn ) {
      addEvent( doc, event, function( e ) {
        var target = getTarget( e ),
            matches = target.parentNode[ querySelectorAll ]( selector ),
            length = matches.length,
            i = 0;

        for ( ; i < length; i++ ) {
          if ( matches[ i ] === target ) {
            fn.call( target, e );
            return;
          }
        }
      } );

      // return elements to allow chaining
      return elements;
    };

    return elements;
  },

  // holds references to all the functions to call on DOMReady
  readyFunctions = [],

  // this is fired on DOMReady to call all the queued functions
  doReady = function() {
    while ( readyFunctions.length ) {
      // we use shift to make sure the functions only get called once
      readyFunctions.shift()();
    }
  };

  /**
   *  $.ready( fn )
   *  - fn (Function): the function to call on DOMReady
   **/
  Thin.ready = function( fn ) {
    if ( doc.readyState === "complete" ) {
      fn();
    }
    else {
      readyFunctions.push( fn );
    }
  };

  // set up doReady to fire on DOMReady the "official" way
  if ( w3c ) {
    addEvent( doc, "DOMContentLoaded", doReady );
  }

  // IE doesn't support DOMContentLoaded so we use this which fires earlier
  // than window.onload: http://javascript.nwbox.com/IEContentLoaded/
  if ( doc.documentElement.doScroll ) {
    // anonymous self-executing repeater which stops after calling doReady
    ( function() {
      try {
        doc.documentElement.doScroll( "left" );
        doReady();
      }
      catch ( e ) {
        setTimeout( arguments.callee, 0 );
      }
    } )();
  }

  // fire doReady on window load, just as a backup
  addEvent( window, "load", doReady );

  // expose the library
  window.$ = Thin;
})();
