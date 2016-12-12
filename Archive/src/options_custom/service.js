/**
 * Created by OmriK on 11/03/16.
 */
(function() {

    'use strict';

    angular
        .module('options')
        .service('options', options);

    options.$inject = ['localStorageService'];

    function options(storage) {
        var userName = '',
            service = {
                username: _getUserName
            };

        return service;


        function _getUserName() {
            storage.get('username') || storage.set('username');
        }

    }

})();