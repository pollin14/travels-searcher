(function ($) {
    'use strict';

    var defaultTranslations = {
        cities: 'Cities (All the terminals)',
        terminals: 'Terminals'
    };
    var defaultOptions = {
        resultsAmount: 5
    };

    /**************************************************************************
     * typeAheadByCategories widget definition
     *************************************************************************/

    $.widget('clickbus.typeAheadByCategories', $.ui.autocomplete, {
        options: defaultOptions,
        _create: function () {
            this._super();
            this.widget().menu( 'option', 'items', '> :not(.ui-autocomplete-category)' );

            if (typeof typeAheadByCategoriesTranslations === 'undefined') {
                this.translations = defaultTranslations;
            } else {
                this.translations = typeAheadByCategoriesTranslations;
            }
        },
        _renderMenu: function (ul, items) {
            var that            = this;
            var sortedItems     = that.options.sort(items);
            var cities          = sortedItems.filter(function (item) {
                return item.isCity;
            });
            var terminals       = sortedItems.filter(function (item) {
                return !item.isCity;
            });

            this.renderCities(ul, cities);
            this.renderTerminals(ul, terminals);
        },
        _renderItem: function (ul, item) {
            return $('<li>')
                .append(item.label)
                .appendTo(ul);
        },
        renderCities: function (ul, items) {
            var that = this;

            this.renderHeader(ul, this.translations.cities);

            $.each(items, function (index, item) {
                var itemData = $.extend({}, item, {
                    label: item.city + '&nbsp;<span class="state">' + item.state + '</span>',
                });

                that._renderItemData(ul, itemData);
            });
        },
        renderTerminals: function (ul, items) {
            var that = this;

            this.renderHeader(ul, this.translations.terminals);

            $.each(items, function (index, item) {
                var label =
                    item.terminal +
                    '&nbsp;<span class="city">' + item.city + '</span>' +
                    '&nbsp;<span class="state">' + item.state + '</span>';
                var itemData = $.extend({}, item, {
                    label: label
                });

                that._renderItemData(ul, itemData);
            });
        },
        renderHeader: function (ul, label) {
            $('<li>')
                .addClass('ui-autocomplete-category')
                .append(label)
                .appendTo(ul);
        }
    });

    $.extend($.clickbus.typeAheadByCategories, {
        filter: function(array, term, property) {
            property = typeof property === 'undefined'? label: property;

            var matcher = new RegExp($.ui.autocomplete.escapeRegex(term), "i");
            return $.grep(array, function(value){
                if (value[property] !== null) {
                    return matcher.test(latinize(value[property]));
                }

                return matcher.test(value.value || value);
            });
        },
        splice: function (matchPlaces, isCity, limit) {
            var places      = matchPlaces.slice(0, limit);

            return places.map(function (place) {
                place.isCity = isCity;
                return place;
            });
        }
    });
})(jQuery);
