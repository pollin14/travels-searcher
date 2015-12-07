(function ($) {
    'use strict';

    var defaultOptions = {
        autoShow: false,
        autoHide: false
    };

    $.widget('clickbus.tooltip', $.ui.tooltip, {
        options: defaultOptions,
        _create: function () {
            this._super();
            if (!this.options.autoShow) {
                this._off(this.element, 'mouseover focusin');
            }
        },
        _open: function( event, target, content ) {
            this._superApply(arguments);

            if (!this.options.autoHide) {
                this._off(target, 'mouseleave focusout');
            }
        }
    });
})(jQuery);