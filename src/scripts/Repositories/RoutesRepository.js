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
            name: 'Name return Return',
            value: 'Ciudad value Return seachable',
            slug: 'ciudad-de-mexico-return',
            priority: 0,
            city: 'México Return',
            terminal: 'Todas las return ',
            state: 'DX'
        }
    ];
};
