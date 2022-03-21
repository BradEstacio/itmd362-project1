'use strict';

var html = document.querySelector('html')

// Add a `js` class for any JavaScript-dependent CSS
// See https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
html.classList.add('js');

// Logic for payment form
if(html.id === 'payment') {
  var form = document.querySelector('form[name="payment"]');
  restoreFormDataFromLocalStorage(form.name);
  form.addEventListener('input', debounce(handleFormInputActivity, 850));
  form.addEventListener('change', handleFormInputActivity);
  form.addEventListener('submit', handleFormSubmission);
}

// Logic for billing form
if(html.id === 'billing') {
  var form = document.querySelector('form[name="billing"]');
  restoreFormDataFromLocalStorage(form.name);
  form.addEventListener('input', debounce(handleFormInputActivity, 850));
  form.addEventListener('change', handleFormInputActivity);
  form.addEventListener('submit', handleFormSubmission);
}

// Logic for shipping form
if(html.id === 'shipping') {
  var form = document.querySelector('form[name="shipping"]');
  restoreFormDataFromLocalStorage(form.name);
  form.addEventListener('input', debounce(handleFormInputActivity, 850));
  form.addEventListener('change', handleFormInputActivity);
  form.addEventListener('submit', handleFormSubmission);

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
  Callback Functions
*/

function handleFormInputActivity(event) {
  var inputElements = ['INPUT', 'SELECT'];
  var targetElement = event.target;
  var targetType = targetElement.getAttribute('type');
  var targetName = targetElement.getAttribute('name');
  if (!inputElements.includes(targetElement.tagName) || targetName === 'billing-address-two' || targetName === 'shipping-address-two') {
    return; // this is not an element we care about
  }

  var submitButton = document.getElementById('submit');

  // Implicit 'else', care of the `return;` statement above...
  var errorClass = targetElement.name + '-error';
  var errorEl = document.querySelector('.' + errorClass);

  if(targetType === 'text' && targetElement.tagName === 'INPUT') {
    if (targetElement.value.length < 3) {
      // Don't add duplicate errors
      if (!errorEl) {
        var errorText = capitalizeFirstLetter(targetElement.name) + ' must be at least 3 characters';
        errorEl = document.createElement('p');
        errorEl.className = errorClass
        errorEl.innerText = errorText;
        targetElement.before(errorEl);
        submitButton.disabled = true;
      }
    } else {
      if (errorEl) {
        errorEl.remove();
        submitButton.disabled = false;
      }
    }
  }
  if(targetType === 'number') {
    if(targetName === 'card-number') {
      var ccCheck = /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;
      if(!ccCheck.test(targetElement.value)) {
        if(!errorEl) {
          var errorText = capitalizeFirstLetter(targetElement.name) + ' must be a valid credit card';
          errorEl = document.createElement('p');
          errorEl.className = errorClass
          errorEl.innerText = errorText;
          targetElement.before(errorEl);
          submitButton.disabled = true;
        }
      }
      else {
        if (errorEl) {
          errorEl.remove();
          submitButton.disabled = false;
        }
      }
    }
    if(targetName === 'cvv') {
      var cvvCheck = /^[0-9]{3,4}$/;
      if(!cvvCheck.test(targetElement.value)) {
        if(!errorEl) {
          var errorText = capitalizeFirstLetter(targetElement.name) + 'must be a valid CVV number';
          errorEl = document.createElement('p');
          errorEl.className = errorClass
          errorEl.innerText = errorText;
          targetElement.before(errorEl);
          submitButton.disabled = true;
        }
      }
      else {
        if (errorEl) {
          errorEl.remove();
          submitButton.disabled = false;
        }
      }
    }
    if(targetName === 'billing-zip' || targetName === 'shipping-zip') {
      var zipCheck = /^\d{5}(?:[-\s]\d{4})?$/;
      if(!zipCheck.test(targetElement.value)) {
        if(!errorEl) {
          var errorText = capitalizeFirstLetter(targetElement.name) + ' must be a valid ZIP code';
          errorEl = document.createElement('p');
          errorEl.className = errorClass
          errorEl.innerText = errorText;
          targetElement.before(errorEl);
          submitButton.disabled = true;
        }
      }
      else {
        if (errorEl) {
          errorEl.remove();
          submitButton.disabled = false;
        }
      }
    }
  }
  if(targetType === 'tel') {
    var zipCheck = /\d{9}/;
    if(!zipCheck.test(targetElement.value)) {
      if(!errorEl) {
        var errorText = capitalizeFirstLetter(targetElement.name) + ' must be a valid telephone number';
        errorEl = document.createElement('p');
        errorEl.className = errorClass
        errorEl.innerText = errorText;
        targetElement.before(errorEl);
        submitButton.disabled = true;
      }
    }
    else {
      if (errorEl) {
        errorEl.remove();
        submitButton.disabled = false;
      }
    }
  }

  writeFormDataToLocalStorage(targetElement.form.name, targetElement);
}

function handleFormSubmission(event) {
  var targetElement = event.target;
  event.preventDefault(); // STOP the default browser behavior
  writeFormDataToLocalStorage(targetElement.name); // STORE all the form data
  window.location.href = targetElement.action; // PROCEED to the URL referenced by the form action
}


/*
  Core Functions
*/

function writeFormDataToLocalStorage(formName, inputElement) {
  var formData = findOrCreateLocalStorageObject(formName);

  // Set just a single input value
  if (inputElement) {
    formData[inputElement.name] = inputElement.value;
  } else {
    // Set all form input values, e.g., on a submit event
    var formElements = document.forms[formName].elements;
    for (var i = 0; i < formElements.length; i++) {
      // Don't store empty elements, like the submit button
      if (formElements[i].value !== "") {
        formData[formElements[i].name] = formElements[i].value;
      }
    }
  }

  // Write the formData JS object to localStorage as JSON
  writeJsonToLocalStorage(formName, formData);
}

function findOrCreateLocalStorageObject(keyName) {
  var jsObject = readJsonFromLocalStorage(keyName);

  if (Object.keys(jsObject).length === 0) {
    writeJsonToLocalStorage(keyName, jsObject);
  }

  return jsObject;
}

function readJsonFromLocalStorage(keyName) {
  var jsonObject = localStorage.getItem(keyName);
  var jsObject = {};

  if (jsonObject) {
    try {
      jsObject = JSON.parse(jsonObject);
    } catch(e) {
      console.error(e);
      jsObject = {};
    }
  }

  return jsObject;
}

function writeJsonToLocalStorage(keyName, jsObject) {
  localStorage.setItem(keyName, JSON.stringify(jsObject));
}

function destroyFormDataInLocalStorage(formName) {
  localStorage.removeItem(formName);
}

function restoreFormDataFromLocalStorage(formName) {
  var jsObject = readJsonFromLocalStorage(formName);
  var formValues = Object.entries(jsObject);
  if (formValues.length === 0) {
    return; // nothing to restore
  }
  var formElements = document.forms[formName].elements;
  for (var i = 0; i < formValues.length; i++) {
    console.log('Form input key:', formValues[i][0], 'Form input value:', formValues[i][1]);
    formElements[formValues[i][0]].value = formValues[i][1];
  }
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
