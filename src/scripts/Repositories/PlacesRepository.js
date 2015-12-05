'use strict';

/**
 * @constructor
 */
var PlacesRepository = function () {

};

/**
 * @param {bool} enabledPagination (optional, default:true)
 * @return a collection of object with the next properties.
 * <code>
 *     {
 *          name: "The place name"
 *          value: "This field was use to do the search",
 *          slug: "slug of the place",
 *          priority: "Integer Positive. More big more priority"
 *          city: "City name"
 *          terminal: "Terminal name"
 *     }
 * </code>
 */
PlacesRepository.prototype.findAll = function (enabledPagination) {

    enabledPagination = typeof enabledPagination === 'boolean'? enabledPagination: true;

    return [
        {
            name: 'Ciudad de México',
            value: 'Ciudad de México seachable',
            slug: 'ciudad-de-mexico-todas-las-terminales',
            priority: 0,
            city: 'México',
            terminal: 'Todas las terminales',
            state: 'DF'
        }
    ];
};
