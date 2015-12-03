(function ($) {
    'use strict';

    /**************************************************************************
     * Widget Definition
     *************************************************************************/

    $.widget('clickbus.typeAheadByCategories', $.ui.autocomplete, {
        _create: function () {
            this._super();
            this.widget().menu( 'option', 'items', '> :not(.ui-autocomplete-category)' );
        },
        _renderMenu: function (ul, items) {
            var that            = this;
            var itemsByCategory = groupByCategory(items);

            $.each(itemsByCategory, function (categoryValue, items) {
                var category = that.findCategoryByValue(categoryValue);

                ul.append('<li class="ui-autocomplete-category">' + category.label + '</li>' );
                that.addItems(ul, items, category);
            });
        },
        addItems: function (ul, items, category) {
            var that = this;

            $.each(items, function (index, item) {
                var li = that._renderItemData(ul, item);
                li.attr('aria-label', category.value + item.value);
            });
        },
        findCategoryByValue: function (value) {

            var categories = this.option('categories');

            for (var i = 0; i < categories.length; i++) {
                if (categories[i].value === value) {
                    return categories[i];
                }
            }

            return null;
        }
    });

    /**************************************************************************
     * Private functions
     *************************************************************************/

    var groupByCategory =function (items) {

        var byCategory = {};

        $.each(items, function (index, item) {
            if (typeof byCategory[item.category] === 'undefined') {
                byCategory[item.category] = [];
            }

            byCategory[item.category].push(item);
        });

        return byCategory;
    };
})(jQuery);