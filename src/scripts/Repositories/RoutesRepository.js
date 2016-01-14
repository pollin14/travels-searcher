(function ($) {
    'use strict';

    /**
     *
     * @constructor
     */
    var RoutesRepository = function (placeRepository, url) {
        this.url = url;
        this.placeRepository = placeRepository;
        this.adjacencyList = null;
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
                that.adjacencyList = adjacencyList;
                var ids = adjacencyList.map(function (item) {
                    return item.arrival;
                });

                return that.placeRepository.findByIds(ids);
            }, function (response) {
                if (typeof console !== 'undefined') {
                    console.log(response);
                }
            });
    };

    RoutesRepository.prototype.getAdjacencyListFromCache = function () {
        return this.adjacencyList;
    };

    window.RoutesRepository = RoutesRepository;
})(jQuery);