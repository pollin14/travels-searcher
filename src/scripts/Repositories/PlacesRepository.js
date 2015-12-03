'use strict';

/**
 * @constructor
 */
var PlacesRepository = function () {

};

/**
 * @param {bool} enabledPagination (optional, default:true)
 */
PlacesRepository.prototype.findAll = function (enabledPagination) {

    enabledPagination = typeof enabledPagination === 'boolean'? enabledPagination: true;

    return [
        {
            value: 'Terminal del Norte',
            slug: 'terminal-del-norte',
            priority: 0,
            category: 'terminal'
        },
        {
            value: 'Terminal Querétaro',
            slug: 'terminal-queretaro',
            priority: 0,
            category: 'terminal'
        },
        {
            value: 'Ciudad de México',
            slug: 'ciudad-de-mexico',
            priority: 1,
            category: 'city'
        },
        {
            value: 'Monterrey',
            slug: 'monterrey',
            priority: 0,
            category: 'city'
        }
    ];
};
