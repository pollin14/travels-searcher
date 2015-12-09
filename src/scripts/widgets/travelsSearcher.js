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
        internalDateFormat: 'yy-mm-dd', //Only format supported
        sort: identity,
        placesUrl: '/places',
        adjacencyListUrl: '/adjacency-list'
    };
    var controls = {
        $origin: null,
        $destination: null,
        $departureDate: null,
        $returnDate: null
    };
    var travelSearcherForm = null;

    /**************************************************************************
     * Widget Definition
     *************************************************************************/

    $.widget('clickbus.travelsSearcher', $.Widget, {
        options: defaultOptions,
        _create: function () {
            var placesRepository    = new PlacesRepository(this.options.placesUrl);
            var routesRepository    = new RoutesRepository(placesRepository, this.options.adjacencyListUrl);

            var $widgetForm         = $(this.element);

            travelSearcherForm = new TravelSearcherForm();

            controls.$origin             = $(this.options.origin);
            controls.$destination        = $(this.options.destination);
            controls.$departureDate      = $(this.options.departureDate);
            controls.$returnDate         = $(this.options.returnDate);

            var autocompleteOptions = {
                sort: this.options.sort
            };

            var originAutocompleteOptions = $.extend({}, autocompleteOptions, {
                source: placesRepository.findAll(false),
                select: function (event, ui) {

                    routesRepository
                        .findByOrigin(ui.item.slug)
                        .done(function (destinations) {
                            travelSearcherForm.setOrigin(ui.item);
                            controls.$destination.typeAheadByCategories('option', 'source', destinations);
                            controls.$origin.tooltip('close');
                        });
                }
            });

            var destinationAutocompleteOptions = $.extend({}, autocompleteOptions, {
                source: placesRepository.findAll(false),
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

            $widgetForm.on('submit', this.submitHandler);
        },
        submitHandler: function (event) {
            event.preventDefault();

            if (travelSearcherForm.isValid()) {
                return travelSearcherForm.submit();
            }

            $.each(travelSearcherForm.violations, function (field, violations) {
                if (violations.length === 0) {
                    return;
                }

                controls['$'+ field]
                    .tooltip('option', 'content', violations[0])
                    .tooltip('open');
            });
        }
    });
})(jQuery);
