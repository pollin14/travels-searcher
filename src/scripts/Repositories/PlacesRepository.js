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
     * @return a collection of object with the next properties.
     * <code>
     *     {
     *          id: 123
     *          name: "The place name",
     *          value: "This field will be used to do the search",
     *          slug: "slug of the place",
     *          priority: "Positive Integer. Bigger, more priority",
     *          isGroup: true,
     *          city: "Raccoon City",
     *          terminal: "Terminal name",
     *          state: "DF"
     *     }
     * </code>
     */
    PlacesRepository.prototype.findAll = function () {

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

    /**
     *
     * @param {string}name
     * @returns {Array.<Object>}
     */
    PlacesRepository.prototype.findByName = function (name) {

        return this.places.filter(function (place) {
            return place.name == name;
        });
    };

    /**
     *
     * @param {string} name
     * @returns {null|Object}
     */
    PlacesRepository.prototype.findOneByName = function (name) {

        var places = this.findByName(name);

        if (places.length === 0) {
            return null;
        }

        return places[0];
    };

    window.PlacesRepository = PlacesRepository;
})();
