(function ($) {
    'use strict';

    var defaultTranslations = {
        cities: 'Cities (All the terminals)',
        terminals: 'Terminals'
    };

    /**************************************************************************
     * Widget Definition
     *************************************************************************/

    $.widget('clickbus.typeAheadByCategories', $.ui.autocomplete, {
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

            this.renderCities(ul, sortedItems);
            this.renderTerminals(ul, sortedItems);
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

})(jQuery);
