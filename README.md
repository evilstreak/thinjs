Thin JS - Super lightweight javascript library
==============================================

## What does it do?

Thin JS is intentionally lightweight (**under 1KB** after minification in
fact). It lacks features because it's meant for use where you want to add a
little javascript to a site but not enough to include the 56k that [jQuery][]
weighs after minification. If you're doing enough stuff that the features of
Thin JS don't cut it for you then just man up and use a full library.

## Selectors

Uses `document.querySelectorAll` to find elements which means it's
blistering fast with a tiny footprint, but only supports IE8, FF3.5, Safari
3.2+, Chrome (all versions) and Opera 10. Thin JS will fail silently in
other browsers.

## Each

Use `$().each` by passing a function to be executed for each element in the
result set with `this` set to be the element in question.

    $( "p code" ).each( function() {
      this.style.backgroundColor = "#d8fcce";
      this.style.color = "green";
    } );

## Event binding

Bind events using `$().bind` by passing the event type to bind to and the
function to be bound.

    $( "h2" ).bind( "click", function() {
      this.style.color = "#d11";
    } );

## Event delegation

Delegate events using `$().live` by passing the event type to bind to and the
function to be bound.

    $( "h2" ).live( "click", function() {
      this.style.color = "#d11";
    } );

## DOM Ready

You can use `$.ready` to set functions to be executed once the DOM is ready.

[jQuery]: http://jquery.com
