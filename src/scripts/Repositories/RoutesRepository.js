'use strict';

/**
 *
 * @constructor
 */
var RoutesRepository = function () {

};

RoutesRepository.prototype.findByOrigin = function (origin) {

    return [
        {
            value: 'Terminal de Regreso',
            slug: 'terminal-de-regreso',
            priority: 0,
            category: 'terminal'
        },
        {
            value: 'Ciudad de Regreso',
            slug: 'ciudad-de-regreso',
            priority: 1,
            category: 'city'
        }
    ];
};
