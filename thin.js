// Thin JS. (C) 2009 Dominic Baggott. Released under MIT license
(function() {
  var doc = document,
  addEventListener = "addEventListener",
  w3c = !!doc[ addEventListener ],
  querySelectorAll = "querySelectorAll",

  getTarget = function( event ) {
    event = event || window.event;
    return event.target || event.srcElement;
  },

  addEvent = function( element, event, fn ) {
    w3c
      ? element[ addEventListener ]( event, fn, false )
      : element.attachEvent( 'on' + event, function( e ) { fn.call( getTarget( e ), e ); } );
  },

  /**
   *  $( selector )
   *  - selector (String): selector to use to find elements
   *
   *  Browsers which don't support document.querySelectorAll will always
   *  return an empty list.
   **/
  Thin = function( selector ) {
    // use an empty array to fail silently in unsupported browsers
    var elements = doc[ querySelectorAll ] ? doc[ querySelectorAll ]( selector ) : [];

    /**
     *  bind( event, fn )
     *  - event (String): the name of the event, e.g. click, hover
     *  - fn (Function): the function to call when the event triggers
     **/
    elements.bind = function( event, fn ) {
      for ( var i = 0; i < elements.length; i++ ) addEvent( elements[ i ], event, fn );
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
    };

    /**
     *  each( fn )
     *  - fn (Function): the function to call for each element
     **/
    elements.each = function( fn ) {
      for ( var i = 0; i < elements.length; i++ ) fn.call( elements[ i ], i );
    };

    return elements;
  },

  // holds references to all the functions to call on DOMReady
  readyFunctions = [],

  // this is fired on DOMReady to call all the queued functions
  doReady = function() {
    while ( readyFunctions.length ) readyFunctions.shift()();
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

  // set up doReady to fire on DOMReady
  if ( w3c )
    addEvent( doc, "DOMContentLoaded", doReady );
  else if ( doc.documentElement.doScroll )
    ( function() {
      try {
        doc.documentElement.doScroll( "left" );
        doReady();
      }
      catch ( e ) {
        setTimeout( arguments.callee, 0 );
      }
    } )();

  // fire doReady on window load, just as a backup
  addEvent( window, "load", doReady );

  // expose the library
  window.$ = Thin;
})();
