/*!
 * filename: app.js
 * Kaltura Customer Care's Chrome Extension
 * 0.0.1
 *
 * Copyright(c) 2015 Omri Katz <omri.katz@kaltura.com>
 * MIT Licensed. http://www.opensource.org/licenses/mit-license.php
 *
 * http://corp.kaltura.com
 */

var myApp = angular.module('myApp', []);

myApp.controller('customerCareCtrl', function ($scope) {
    Foundation.global.namespace = '';
    $scope.activeFoundation = $(document).foundation();
	$scope.openJira = function() {
		if (typeof $scope.jira != 'undefined') {
			var url = 'https://kaltura.atlassian.net/browse/' + $scope.jira;
			window.open(url, '_blank');
		}
	}
});

myApp.directive('myEnter', function () { //directive that listen to "Enter" keypress
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});
