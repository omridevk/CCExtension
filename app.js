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

var myApp = angular.module('myApp',[]);

chrome.contextMenus.create({
  id: 'open',
  title: chrome.i18n.getMessage('openContextMenuTitle'),
  contexts: ['link'],
});


myApp.controller('customerCareCtrl', function ($scope) {

    Foundation.global.namespace = '';
    $scope.activeFoundation = $(document).foundation();
    $(function () {
        $('[data-toggle="popover"]').popover()
    })
    $scope.getKs = function() {

        //send message from browser_action(popup window) to content_script(inject.js) to display prompt with the ks.
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "getKs"}, function(response) {
                $scope.$apply(function() {
                    if (response)
                         $scope.ks = response.ks["kmc.vars.ks"];
                        // $("#joyrideDiv").foundation('joyride', 'start');
                        
                });
                $('#ks-input-box').select();
                document.execCommand('copy');

            });  
        });
    }

    $scope.getPlayerInfo = function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
           chrome.tabs.sendMessage(tabs[0].id, {action: "getPlayerInfo"}, function(response) {});  
        });
    }

    $scope.displayURLQRCode = function($event) {
        document.getElementById('spinner').style.display = 'block';
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                document.getElementById('spinner').style.display = 'none';
                $scope.qrCodeImgSrc = 'http://chart.googleapis.com/chart?cht=qr&chs=300x300&choe=UTF-8&chld=H&chl=' + tabs[0].url;
                $scope.$apply();
        });
    }


	$scope.openJira = function() {

		if (typeof $scope.jira != 'undefined') {
			var url = 'https://kaltura.atlassian.net/browse/' + $scope.jira;
			window.open(url, '_blank');

		}
	}


    $scope.openSalesforce = function() {
        if (typeof $scope.salesforce != 'undefined') {
            var url = 'https://na5.salesforce.com/_ui/search/ui/UnifiedSearchResults?searchType=2&sen=a1d&sen=a0S&sen=00a&sen=005&sen=001&sen=500&sen=003&str=' + $scope.salesforce;
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



document.addEventListener('DOMContentLoaded', function() {
    var scope = angular.element($("body")).scope();
    scope.this.getKs();
});

