'use strict';

(function () {

    var validations = {
        origin: {
            required: {
                message: 'The origin is required',
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
        returnDate: ''
    };

    var serialize = function (data) {

        var query = '';
        for (var property in data) {
            if (data.hasOwnProperty(property)) {
                query += property + '=' + data[property] + '&';
            }
        }

        return query.substr(0, query.length -1);
    };

    /**
     *
     * @param {string} url
     * @constructor
     */
    var TravelSearcherForm = function (url) {

        this.url = typeof url === 'undefined'? '/': url;

        this.violations = {
            origin: [],
            destination: []
        };
    };

    TravelSearcherForm.prototype.setOrigin = function (value) {
        data.origin         = value;
        data.destination    = '';
    };

    TravelSearcherForm.prototype.setDestination = function (value) {
        data.destination = value;
    };

    TravelSearcherForm.prototype.submit = function () {

        var baseUrl = this.url + data.origin + '/' + data.destination;

        var query = {
            isGroup: 0,
            departureDate: data.departureDate
        };

        if (data.returnDate !== '') {
            query.returnDate = data.returnDate;
        }

        window.location =  baseUrl + '?' + serialize(query);
    };

    TravelSearcherForm.prototype.isValid = function () {

        var valid = true;

        for (var validation in validations) {
            if (validations.hasOwnProperty(validation)) {
                valid = valid && this.isFieldValid(validation, data[validation]);
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
})();
