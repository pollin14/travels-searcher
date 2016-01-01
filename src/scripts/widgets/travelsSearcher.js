(function ($) {
    'use strict';

    var identity        = function (collection) {return collection;};
    var today           = new Date();
    var defaultOptions  = {
        origin: 'input.origin',
        destination: 'input.destination',
        departureDate: 'input.departure-date',
        returnDate: 'input.return-date',
        datepicker: {
            dateFormat: 'dd/mm/yy', //Only format supported,
            numberOfMonths: 2
        },
        tooltips: {
            origin: {
                textualPosition: 'right'
            },
            destination: {
                textualPosition: 'right'
            },
            departureDate: {
                textualPosition: 'bottom'
            }
        },
        internalDateFormat: 'yy-mm-dd', //Unique format supported
        sort: identity,
        placesUrl: '/places',
        adjacencyListUrl: '/adjacency-list',
        amountResults: 5,
        searchResultsUrl: '/'
    };
    var controls = {
        $origin: null,
        $destination: null,
        $departureDate: null,
        $returnDate: null
    };
    var travelSearcherForm = null;
    var that = null;
    var sendingAttempts = 0;

    /**************************************************************************
     * travelsSearcher widget definition
     *************************************************************************/

    $.widget('clickbus.travelsSearcher', $.Widget, {
        options: defaultOptions,
        _create: function () {
            var placesRepository    = new PlacesRepository(this.options.placesUrl);
            var routesRepository    = new RoutesRepository(placesRepository, this.options.adjacencyListUrl);

            var $widgetForm         = $(this.element);

            that               = this;
            travelSearcherForm = new TravelSearcherForm(this.options.searchResultsUrl);

            controls.$origin             = $(this.options.origin);
            controls.$destination        = $(this.options.destination);
            controls.$departureDate      = $(this.options.departureDate);
            controls.$returnDate         = $(this.options.returnDate);

            var matcher = function (places, request, response) {
                var typeAhead       = $.clickbus.typeAheadByCategories;

                var matchCities     = typeAhead.filter(places, request.term, 'city');
                var matchTerminal   = typeAhead.filter(places, request.term, 'terminal');
                var cities          = typeAhead.splice(matchCities, true, that.options.amountResults);
                var terminals       = typeAhead.splice(matchTerminal, false, that.options.amountResults);
                var matchPlaces     = cities.concat(terminals);

                response(matchPlaces);
            };

            var autocompleteOptions = {
                source: function (request, response) {
                    matcher(placesRepository.findAll(), request, response);
                },
                sort: this.options.sort,
                resultsAmount: this.options.resultsAmount
            };

            var originAutocompleteOptions = $.extend({}, autocompleteOptions, {
                select: function (event, ui) {
                    routesRepository.findByOrigin(ui.item).done(function (destinations) {
                        travelSearcherForm.setOrigin(ui.item);
                        controls.$destination.typeAheadByCategories('option', 'source', function (request, response) {
                            matcher(destinations, request, response);
                        });
                        controls.$origin.tooltip('close');
                    });
                }
            });

            var destinationAutocompleteOptions = $.extend({}, autocompleteOptions, {
                select: function (event, ui) {
                    travelSearcherForm.setDestination(ui.item);
                    controls.$destination.tooltip('close');
                }
            });

            var departureDatePickerOptions = $.extend({}, this.options.datepicker, {
                minDate: today,
                onSelect: function (date) {
                    travelSearcherForm.setDepartureDate(date);
                    controls.$returnDate.datepicker('option', 'minDate', date);
                }
            });

            var returnDatePickerOptions = $.extend({}, this.options.datepicker, {
                onSelect: function (date) {
                    travelSearcherForm.setReturnDate(date);
                    controls.$departureDate.datepicker('option', 'maxDate', date);
                }
            });

            controls.$origin
                .typeAheadByCategories(originAutocompleteOptions)
                .tooltip(this.options.tooltips.origin);
            controls.$destination
                .typeAheadByCategories(destinationAutocompleteOptions)
                .tooltip(this.options.tooltips.destination);
            controls.$departureDate
                .datepicker(departureDatePickerOptions)
                .tooltip(this.options.tooltips.departureDate);
            controls.$returnDate
                .datepicker(returnDatePickerOptions);

            var allControlsSelectors =
                this.options.origin + ',' +
                this.options.destination + ',' +
                this.options.departureDate;

            $widgetForm.on('submit', this.submitHandler);
            $widgetForm.on('focus', allControlsSelectors, function () {

                if (sendingAttempts > 0) {
                    travelSearcherForm.valid();
                    that.showFormErrors();
                }
            });
        },
        submitHandler: function (event) {
            event.preventDefault();

            sendingAttempts++;

            if (travelSearcherForm.isValid()) {
                var controlsWithTooltip = [
                    controls.$origin,
                    controls.$destination,
                    controls.$departureDate
                ];

                $.each(controlsWithTooltip, function (index, control) {
                    control.tooltip('close');
                });

                return travelSearcherForm.submit();
            }

            that.showFormErrors();
        },
        showFormErrors: function () {
            $.each(travelSearcherForm.violations, function (field, violations) {

                var control = controls['$'+ field];

                if (violations.length === 0) {
                    control.tooltip('close');
                    return;
                }

                control
                    .tooltip('option', 'content', violations[0])
                    .tooltip('open');
            });
        }
    });
})(jQuery);
