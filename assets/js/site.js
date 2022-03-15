'use strict';

var shippingIsBillingFieldset = document.querySelector('fieldset[name="check"]');
var shippingIsBillingCheckbox = document.querySelector('#show');

shippingIsBillingFieldset.setAttribute('disabled', 'disabled');
shippingIsBillingFieldset.setAttribute('aria-hidden', 'true');
