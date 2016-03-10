/**
 * Created by OmriK on 11/03/16.
 */

(function() {

    'use strict';

    angular
        .module('options')
        .controller('Options', Options);

    Options.$inject = ['localStorageService'];

    function Options(storage) {
        var vm = this;
        console.log(storage.keys());
        vm.test = "hello";
    }

})();