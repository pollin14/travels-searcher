/* jshint browser: true */

var $origin         = $('.origin');
var $destination    = $('.destination');

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

var data = [
    {
        value: 'Terminal del Norte',
        category: 'terminal'
    },
    {
        value: 'Terminal Querétaro',
        category: 'terminal'
    },
    {
        value: 'Ciudad de México',
        category: 'city'
    },
    {
        value: 'Monterrey',
        category: 'city'
    }
];

$origin.typeAheadByCategories({
    source: data,
    categories: categories,
});
