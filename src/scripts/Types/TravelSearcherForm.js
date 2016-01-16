/* globals validationsTranslations */

(function ($) {
    'use strict';

    var validations = {
        origin: {
            required: {
                message: 'The origin is required',
                isValid: function (value) {
                    return typeof value !== 'undefined' && value !== null && value !== '';
                }
            }
        },
        destination: {
            required: {
                message: 'The destination is required',
                isValid: function (value) {
                    return typeof value !== 'undefined' && value !== null && value !== '';
                }
            }
        },
        departureDate: {
            required: {
                message: 'The departure date is required',
                isValid: function (value) {
                    return typeof value !== 'undefined' && value !== null && value !== '';
                }
            }
        }
    };

    var data = {
        origin: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        doesRouteExist: true
    };

    if (typeof validationsTranslations !== 'undefined') {
        $.extend(true, validations, validationsTranslations);
    }

    var serialize = function (data) {
        // We need to change the name of the properties by compatibility.

        data.ida = data.departureDate;
        delete data.departureDate;

        if (typeof data.returnDate !== 'undefined') {
            data.volta = data.returnDate;
            delete data.returnDate;
        }

        var query = '';
        for (var property in data) {
            if (data.hasOwnProperty(property)) {
                query += property + '=' + data[property] + '&';
            }
        }

        return query.substr(0, query.length -1);
    };

    /**
     * The function assume that the date format given is dd/mm/yy (view jqueryui datepicker formats)
     * @param date
     * @return {string} date in format YYYY/MM/DD,
     */
    var parseDate = function (date) {
        return date.split('/').reverse().join('-');
    };

    /**
     *
     * @param {string} url
     * @constructor
     */
    var TravelSearcherForm = function (url) {

        this.url = typeof url === 'undefined'? '/': url + '/';
        this.violations = {
            origin: [],
            destination: [],
            departureDate: []
        };
    };

    TravelSearcherForm.prototype.setOrigin = function (value) {
        data.origin         = value.slug;
        data.destination    = '';
    };

    TravelSearcherForm.prototype.setDestination = function (value) {
        data.destination    = value.slug;
    };

    TravelSearcherForm.prototype.setDepartureDate = function (value) {

        data.departureDate = parseDate(value);
    };

    TravelSearcherForm.prototype.setReturnDate = function (value) {

        data.returnDate = parseDate(value);
    };

    TravelSearcherForm.prototype.setDoesRouteExist = function (value) {
        data.setDoesRouteExist = value;
    };

    TravelSearcherForm.prototype.getData = function () {
        return data;
    };

    TravelSearcherForm.prototype.submit = function () {

        var baseUrl = this.url + data.origin + '/' + data.destination;

        var query = {
            isGroup: data.doesRouteExist? 0: 1,
            departureDate: data.departureDate
        };

        if (data.returnDate !== '') {
            query.returnDate = data.returnDate;
        }

        window.location =  baseUrl + '?' + serialize(query);
    };

    TravelSearcherForm.prototype.valid = function () {

        this.isValid();
    };

    TravelSearcherForm.prototype.isValid = function () {

        var valid = true;

        this.violations = {
            origin: [],
            destination: [],
            departureDate: []
        };

        for (var validation in validations) {
            if (validations.hasOwnProperty(validation)) {
                valid = this.isFieldValid(validation, data[validation]) && valid;
            }
        }

        return valid;
    };

    TravelSearcherForm.prototype.isFieldValid = function (field, value) {

        var valid = true;
        for (var ruleName in validations[field]) {
            if (validations[field].hasOwnProperty(ruleName)) {
                var rule        = validations[field][ruleName];
                var validField  = rule.isValid(value);

                if (!validField) {
                    this.violations[field].push(rule.message);
                }

                valid = valid && validField;
            }
        }

        return valid;
    };

    window.TravelSearcherForm = TravelSearcherForm;
})(jQuery);
