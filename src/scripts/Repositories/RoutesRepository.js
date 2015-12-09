(function ($) {
    'use strict';

    /**
     *
     * @constructor
     */
    var RoutesRepository = function (placeRepository, url) {
        this.url = url;
        this.placeRepository = placeRepository;
    };

    /**
     *
     * @param origin
     * @returns {*}
     */
    RoutesRepository.prototype.findByOrigin = function (origin) {
        var that = this;

        return $
            .getJSON(this.url, {placeId: origin.id})
            .then(function (adjacencyList) {
                var ids = adjacencyList.map(function (item) {
                    return item.arrival;
                });

                return that.placeRepository.findByIds(ids);
            });
    };

    window.RoutesRepository = RoutesRepository;
})(jQuery);