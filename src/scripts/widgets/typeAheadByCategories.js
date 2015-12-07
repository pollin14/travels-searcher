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
                that._renderItemData(ul, {
                    value: item.name,
                    label: item.city + '<span class="state">' + item.state + '</span>',
                    slug: item.slug
                });
            });
        },
        renderTerminals: function (ul, items) {
            var that = this;

            this.renderHeader(ul, this.translations.terminals);

            $.each(items, function (index, item) {
                var label =
                    item.terminal +
                    '<span class="city">' + item.city + '</span>' +
                    ' <span class="state">' + item.state + '</span>';

                that._renderItemData(ul, {
                    value: item.name,
                    label: label,
                    slug: item.slug
                });
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
