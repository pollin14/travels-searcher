(function ($) {
    'use strict';

    var defaultOptions = {
        autoShow: false,
        autoHide: false,
        textualPosition: 'right'
    };

    var positions = {
        top: {my: 'center bottom', at: 'center top-10' },
        bottom: {my: 'center top', at: 'center bottom+10'},
        left: {my: 'right center', at: 'left-10 center' },
        right: {my: 'left center', at: 'right+10 center' }
    };

    $.widget('clickbus.tooltip', $.ui.tooltip, {
        options: defaultOptions,
        _create: function () {
            this._super();
            if (!this.options.autoShow) {
                this._off(this.element, 'mouseover focusin');
            }
        },
        _open: function(event, target, content) {

            var position = positions[this.options.textualPosition];
            position.collision = 'none';
            $(this.element).tooltip('option', 'position', position);
            $(this.element).tooltip('option', 'tooltipClass', this.options.textualPosition);

            this._superApply(arguments);
            if (!this.options.autoHide) {
                this._off(target, 'mouseleave focusout');
            }
        }
    });
})(jQuery);