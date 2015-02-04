// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });

Foundation.set_namespace = function() {};
$(document).foundation();
var myApp = angular.module('myApp', []);

myApp.controller('customerCareCtrl', function ($scope) {
  $scope.openJira = function() {
    if ($scope.jira != undefined) {
      var url = 'https://kaltura.atlassian.net/browse/' + $scope.jira;
      window.open(url, '_blank');
    }
  }
});


function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  console.log(queryInfo);
}


myApp.directive('myEnter', function () {
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

// window.open(url, '_blank')