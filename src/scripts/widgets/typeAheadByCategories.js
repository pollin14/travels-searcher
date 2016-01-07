(function ($) {
    'use strict';

    var START_INDEX = 0;

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
            var cities = sortedItems.filter(function (item) {
                return item.isGroup;
            }).splice(START_INDEX, that.options.resultsAmount);
            var terminals = sortedItems.filter(function (item) {
                return !item.isGroup;
            }).splice(START_INDEX, that.options.resultsAmount);

            if (cities.length > 0) {
                this.renderCities(ul, cities);
            }

            if (terminals.length > 0) {
                this.renderTerminals(ul, terminals);
            }
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
        filter: function(array, term) {
            var property = 'name';
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(latinize(term)), "i");

            return $.grep(array, function(value){
                if (value[property] !== null) {
                    return matcher.test(latinize(value[property]));
                }

                return matcher.test(value.value || value);
            });
        },
        splice: function (matchPlaces, limit) {
             return matchPlaces.slice(0, limit);
        }
    });
})(jQuery);
