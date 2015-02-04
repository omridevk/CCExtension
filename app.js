var myApp = angular.module('myApp', []);

myApp.controller('customerCareCtrl', function ($scope) {
	$scope.openJira = function() {
		if (typeof $scope.jira != 'undefined') {
			var url = 'https://kaltura.atlassian.net/browse/' + $scope.jira;
			window.open(url, '_blank');
		}
	}
});

$(document).foundation();
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
