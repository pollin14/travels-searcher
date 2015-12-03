'use strict';

var $origin         = $('.origin');
var $destination    = $('.destination');
var $widgetForm     = $('.dummy-travel-searcher-form');

var categories = [
    {
        label: 'Terminal',
        value: 'terminal'
    },
    {
        label: 'Ciudad',
        value: 'city'
    }
];

var travelSearcherForm  = new TravelSearcherForm();
var routesRepository    = new RoutesRepository();
var placesRepository    = new PlacesRepository();

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