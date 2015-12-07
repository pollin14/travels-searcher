(function ($) {
    'use strict';

    var identity        = function (collection) {return collection;};
    var defaultOptions  = {
        origin: 'input.origin',
        destination: 'input.destination',
        sort: identity
    };
    var controls = {
        $origin: null,
        $destination: null
    };
    var travelSearcherForm = null;

    /**************************************************************************
     * Widget Definition
     *************************************************************************/

    $.widget('clickbus.travelsSearcher', $.Widget, {
        options: defaultOptions,
        _create: function () {
            var routesRepository    = new RoutesRepository();
            var placesRepository    = new PlacesRepository();

            var $widgetForm         = $(this.element);

            travelSearcherForm = new TravelSearcherForm();

            controls.$origin             = $(this.options.origin);
            controls.$destination        = $(this.options.destination);

            var autocompleteOptions = {
                sort: this.options.sort
            };

            var originAutocompleteOptions = $.extend({}, autocompleteOptions, {
                source: placesRepository.findAll(false),
                select: function (event, ui) {
                    var destinations = routesRepository.findByOrigin(ui.item.slug);

                    travelSearcherForm.setOrigin(ui.item.slug);
                    controls.$destination.typeAheadByCategories('option', 'source', destinations);
                    controls.$origin.tooltip('close');
                }
            });

            var destinationAutocompleteOptions = $.extend({}, autocompleteOptions, {
                source: placesRepository.findAll(false),
                select: function (event, ui) {
                    travelSearcherForm.setDestination(ui.item.slug);
                    controls.$destination.tooltip('close');
                }
            });


            controls.$origin
                .typeAheadByCategories(originAutocompleteOptions)
                .tooltip();
            controls.$destination
                .typeAheadByCategories(destinationAutocompleteOptions)
                .tooltip();

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
