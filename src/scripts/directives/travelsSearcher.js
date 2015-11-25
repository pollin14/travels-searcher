'use strict';

angular
    .module('travelsSearcher')
    .directive('travelsSearcher', function () {

        return {
            restrict: 'AEC',
            templateUrl: 'views/travels-searcher.html'
        };
    });