/* globals placesRepositoryData */

(function () {
    'use strict';

    /**
     * @constructor
     */
    var PlacesRepository = function () {
        this.places = [];

        if (typeof placesRepositoryData !== 'undefined') {
            this.places = placesRepositoryData;
        } else {
            if (typeof console !== 'undefined') {
                console.log('The places are empties. Maybe you forgot to add the placesRepositoryData.');
            }
        }
    };

    /**
     * @param {bool} enabledPagination (optional, default:true)
     * @return a collection of object with the next properties.
     * <code>
     *     {
     *          id: 123
     *          name: "The place name",
     *          value: "This field was use to do the search",
     *          slug: "slug of the place",
     *          priority: "Integer Positive. More big more priority",
     *          isGroup: true,
     *          city: "Raccoon City",
     *          terminal: "Terminal name",
     *          state: "DF"
     *     }
     * </code>
     */
    PlacesRepository.prototype.findAll = function (enabledPagination) {

        enabledPagination = typeof enabledPagination === 'boolean'? enabledPagination: true;

        return this.places;
    };

    /**
     *
     * @param ids
     * @returns {Array.<id>}
     */
    PlacesRepository.prototype.findByIds = function (ids) {

        return this.places.filter(function (item) {
            return ids.includes(item.id);
        });
    };

    window.PlacesRepository = PlacesRepository;
})();
