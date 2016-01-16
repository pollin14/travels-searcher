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
            numberOfMonths: 2,
            minDate: today
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

    var defaultTranslations = {
        anyRoutFound: 'No hay ninguna ruta que parte de éste lugar'
    };

    /**************************************************************************
     * Event Handlers
     *************************************************************************/

    var submitHandler = function (event) {
        event.preventDefault();

        var that = event.data.that;
        that.sendingAttempts++;

        if (that.travelSearcherForm.isValid()) {
            var controlsWithTooltip = [
                that.controls.$origin,
                that.controls.$destination,
                that.controls.$departureDate
            ];

            $.each(controlsWithTooltip, function (index, control) {
                control.tooltip('close');
            });

            $(this).trigger('clickbus.travels-searcher-submit');

            return that.travelSearcherForm.submit();
        }

        that.showFormErrors();
    };

    var focusHandler = function (event) {
        var that = event.data.that;

        if (that.sendingAttempts > 0) {
            that.travelSearcherForm.valid();
            that.showFormErrors();
        }
    };

    /**************************************************************************
     * travelsSearcher widget definition
     *************************************************************************/

    $.widget('clickbus.travelsSearcher', $.Widget, {
        options: defaultOptions,
        _create: function () {
            var that                        = this;
            var $widgetForm             = $(this.element);

            this.placesRepository       = new PlacesRepository(this.options.placesUrl);
            this.routesRepository       = new RoutesRepository(this.placesRepository, this.options.adjacencyListUrl);
            this.travelSearcherForm     = new TravelSearcherForm(this.options.searchResultsUrl);

            this.controls                   = {};
            this.controls.$origin           = $(this.options.origin);
            this.controls.$destination      = $(this.options.destination);
            this.controls.$departureDate    = $(this.options.departureDate);
            this.controls.$returnDate       = $(this.options.returnDate);

            this.sendingAttempts            = 0;

            this.fillTravelSearcherForm();

            if (typeof travelsSearcherTranlations === 'undefined') {
                this.translations = defaultTranslations;
            } else {
                this.translations = travelsSearcherTranlations;
            }

            var matcher = function (places, request, response) {
                var typeAhead       = $.clickbus.typeAheadByCategories;
                var matchedPlaces = typeAhead.filter(places, request.term);

                response(matchedPlaces);
            };

            var autocompleteOptions = {
                source: function (request, response) {
                    matcher(that.placesRepository.findAll(), request, response);
                },
                sort: this.options.sort,
                resultsAmount: this.options.resultsAmount
            };

            var originSelected = false;
            var eraseDestination = function () {
                that.travelSearcherForm.setOrigin({});
                that.controls.$origin.val('');
                that.controls.$destination.val('');
            };
            var originAutocompleteOptions = $.extend({}, autocompleteOptions, {
                select: function (event, ui) {
                    that.controls.$origin.tooltip('close');

                    that.routesRepository.findByOrigin(ui.item)
                        .done(function (destinations) {
                            that.travelSearcherForm.setOrigin(ui.item);
                            that.controls.$destination.val('');
                            that.controls.$destination.typeAheadByCategories('option', 'source', function (request, response) {
                                matcher(destinations, request, response);
                            });
                        })
                        .fail(function () {
                            that.controls.$origin
                                .tooltip('option', 'content', that.translations.anyRoutFound)
                                .tooltip('open');
                        });

                    originSelected = true;
                    eraseDestination();
                },
                response: function () {
                    originSelected = false;
                },
                change: function () {

                    if (originSelected) {
                        return;
                    }
                    eraseDestination();
                }
            });

            var destinationSelected = false;
            var destinationAutocompleteOptions = $.extend({}, autocompleteOptions, {
                source: [],
                select: function (event, ui) {
                    that.travelSearcherForm.setDestination(ui.item);
                    that.controls.$destination.tooltip('close');
                    destinationSelected = true;

                    /**
                     * We must change the origin place selected by the user with its place group equivalent if
                     * the specific route does not exist.
                     *
                     * All the next logic is some weird
                     */
                    var adjacencyList = that.routesRepository.getAdjacencyListFromCache();
                    var realOriginPlace = adjacencyList.find(function (item) {
                        return item.arrival === ui.item.id;
                    });
                    var redirect =
                        typeof realOriginPlace !== 'undefined' &&
                        realOriginPlace.departure_slug !== that.travelSearcherForm.getData().origin;

                    that.travelSearcherForm.setRedirect(redirect);
                    that.travelSearcherForm.getData().origin = realOriginPlace.departure_slug;

                },
                response: function () {
                    destinationSelected = false;
                },
                change: function() {

                    if (destinationSelected) {
                        return;
                    }

                    that.travelSearcherForm.setDestination({});
                    that.controls.$destination.val('');
                }
            });

            var departureDatePickerOptions = $.extend({}, this.options.datepicker, {
                onSelect: function (date) {
                    that.travelSearcherForm.setDepartureDate(date);
                    that.controls.$returnDate.datepicker('option', 'minDate', date);
                }
            });

            var returnDatePickerOptions = $.extend({}, this.options.datepicker, {
                onSelect: function (date) {
                    that.travelSearcherForm.setReturnDate(date);
                    that.controls.$departureDate.datepicker('option', 'maxDate', date);
                }
            });

            this.controls.$origin
                .typeAheadByCategories(originAutocompleteOptions)
                .tooltip(this.options.tooltips.origin);
            this.controls.$destination
                .typeAheadByCategories(destinationAutocompleteOptions)
                .tooltip(this.options.tooltips.destination);
            this.controls.$departureDate
                .datepicker(departureDatePickerOptions)
                .tooltip(this.options.tooltips.departureDate)
                .change(function () {
                    $(this).val('');
                    that.travelSearcherForm.setDepartureDate('');
                });
            this.controls.$returnDate
                .datepicker(returnDatePickerOptions)
                .change(function () {
                    $(this).val('');
                    that.travelSearcherForm.setReturnDate('');
                });

            var allControlsSelectors =
                this.options.origin + ',' +
                this.options.destination + ',' +
                this.options.departureDate;

            $widgetForm.on('submit', null, {that: this}, submitHandler);
            $widgetForm.on('focus', allControlsSelectors, {that: this}, focusHandler);
        },
        showFormErrors: function () {
            var that = this;
            $.each(that.travelSearcherForm.violations, function (field, violations) {

                var control = that.controls['$'+ field];

                if (violations.length === 0) {
                    control.tooltip('close');
                    return;
                }

                control
                    .tooltip('option', 'content', violations[0])
                    .tooltip('open');
            });
        },
        fillTravelSearcherForm: function () {

            var origin = this.placesRepository.findOneByName(this.controls.$origin.val());
            var destination = this.placesRepository.findOneByName(this.controls.$destination.val());
            var departureDate = this.controls.$departureDate.val();
            var returnDate = this.controls.$returnDate.val();

            this.travelSearcherForm.getData().isGroup = this.controls.$returnDate.val();

            if (origin !== null) {
                this.travelSearcherForm.setOrigin(origin);
            } else {
                this.controls.$origin.val('');
            }

            if (destination !== null) {
                this.travelSearcherForm.setDestination(destination);
            } else {
                this.controls.$destination.val('');
            }

            if (departureDate) {
                this.travelSearcherForm.setDepartureDate(departureDate);
            }

            if (returnDate) {
                this.travelSearcherForm.setReturnDate(returnDate);
            }
        }
    });
})(jQuery);
