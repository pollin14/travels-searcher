(function ($) {
    'use strict';

    var identity = function (collection) {return collection;};

    /**************************************************************************
     * Widget Definition
     *************************************************************************/

    $.widget('clickbus.travelsSearcher', $.Widget, {
        _create: function () {
            var travelSearcherForm  = new TravelSearcherForm();
            var routesRepository    = new RoutesRepository();
            var placesRepository    = new PlacesRepository();
            var categories          = this.options.categories;

            var $origin             = $(this.options.origin);
            var $destination        = $(this.options.destination);
            var $widgetForm         = $(this);

            var autocompleteOptions = {
                categories: categories,
                sort: this.options.sort
            };

            var originAutocompleteOptions = $.extend({}, autocompleteOptions, {
                source: placesRepository.findAll(false),
                select: function (event, ui) {
                    var destinations = routesRepository.findByOrigin(ui.item.slug);

                    travelSearcherForm.add('origin', ui.item.slug);
                    $destination.typeAheadByCategories('option', 'source', destinations);
                }
            });

            var destinationAutocompleteOptions = $.extend({}, autocompleteOptions, {
                source: placesRepository.findAll(false),
                select: function (event, ui) {
                    travelSearcherForm.add('destination', ui.item.slug);
                }
            });

            $origin.typeAheadByCategories(originAutocompleteOptions);
            $destination.typeAheadByCategories(destinationAutocompleteOptions);

            $widgetForm.on('submit', function (event) {
                event.preventDefault();
                travelSearcherForm.submit();
            });
        }
    });

    /**************************************************************************
     * Widget Options by Default
     *************************************************************************/

    $.clickbus.travelsSearcher.prototype.options = {
        origin: '.origin',
        destination: '.destination',
        categories: [],
        sort: identity
    };
})(jQuery);
