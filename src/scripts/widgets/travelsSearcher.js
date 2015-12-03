/* globals $ */
'use strict';

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

            $origin.typeAheadByCategories({
                source: placesRepository.findAll(false),
                categories: categories,
                select: function (event, ui) {
                    var destinations = routesRepository.findByOrigin(ui.item.slug);

                    travelSearcherForm.add('origin', ui.item.slug);
                    $destination.typeAheadByCategories('option', 'source', destinations);
                }
            });

            $destination.typeAheadByCategories({
                source: placesRepository.findAll(false),
                categories: categories,
                select: function (event, ui) {
                    travelSearcherForm.add('destination', ui.item.slug);
                }
            });

            $widgetForm.on('submit', function (event) {
                event.preventDefault();
                travelSearcherForm.submit();
            });
        }
    }
);

/**************************************************************************
 * Widget Options by Default
 *************************************************************************/

$.clickbus.travelsSearcher.prototype.options = {
    origin: '.origin',
    destination: '.destination',
    categories: []
};
