'use strict';

/**
 *
 * @param {string} url
 * @param {string} method GET or POST (case insensitive)
 * @constructor
 */
var TravelSearcherForm = function (url, method) {

    url     = typeof url === 'undefined'? '/': url;
    method  = typeof method === 'undefined'? 'GET': method;

    this.form = document.createElement('form');
    this.form.setAttribute('name', 'travelSearcherForm');
    this.form.setAttribute('method', method);
    this.form.setAttribute('action', url);
};

TravelSearcherForm.prototype.add = function (name, value) {

    var input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', name);
    input.setAttribute('value', value);

    this.form.appendChild(input);
};

TravelSearcherForm.prototype.submit = function () {
    document
        .getElementsByTagName('body')[0]
        .appendChild(this.form);

    document.forms[this.form.getAttribute('name')].submit();
};
