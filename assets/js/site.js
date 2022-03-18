'use strict';

var html = document.querySelector('html')

// Add a `js` class for any JavaScript-dependent CSS
// See https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
html.classList.add('js');

if(html.id === 'payment') {

}

if(html.id === 'billing') {

}

if(html.id === 'shipping') {
  var newAddressFieldset = document.querySelector('fieldset[name="shipping-address"]');
  var newAddressCheckbox = document.querySelector('#shipping-is-billing');

  newAddressFieldset.setAttribute('disabled', 'disabled');
  newAddressFieldset.setAttribute('aria-hidden', 'true');

  newAddressCheckbox.addEventListener('change', function(event) {
    // Add logic to set values only on checked state
    if(event.target.checked) {
      newAddressFieldset.setAttribute('disabled', 'disabled');
      newAddressFieldset.setAttribute('aria-hidden', 'true');
    } else {
      newAddressFieldset.removeAttribute('disabled');
      newAddressFieldset.setAttribute('aria-hidden', 'false');
    }
  });
}

/*
  Utility Functions
*/

function capitalizeFirstLetter(string) {
  var firstLetter = string[0].toUpperCase();
  return firstLetter + string.substring(1);
}

// debounce to not execute until after an action has stopped (delay)
function debounce(callback, delay) {
  var timer; // function-scope timer to debounce()
  return function() {
    var context = this; // track function-calling context
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
    var args = arguments; // hold onto arguments object
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments

    // Reset the timer
    clearTimeout(timer);

    // Set the new timer
    timer = setTimeout(function() {
      // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
      callback.apply(context, args);
    }, delay);
  }
}

// throttle to slow execution to a certain amount of elapsed time (limit)
function throttle(callback, limit) {
  var throttling; // function-scope boolean for testing throttle state
  return function() {
    var context = this; // track function-calling context
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
    var args = arguments; // hold onto arguments object
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments

    // Run the function if not currently throttling
    if (!throttling) {
      // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
      callback.apply(context, args);
      throttling = true;
      setTimeout(function() {
        throttling = false;
      }, limit);
    }
  }
}
