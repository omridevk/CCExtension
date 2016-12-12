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

var myApp = angular.module('myApp',['ngMaterial']).config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');
});

chrome.contextMenus.create({
  id: 'open',
  title: 'test',
  contexts: ['link'],
});

myApp.controller('customerCareCtrl', function ($scope, $mdDialog, $timeout) {


    $scope.status = '  ';
    $scope.notInTabs = {

        displayQRCode: {
            'buttonName': 'Current URL to QR',
            'action': function(ev) {
                var that = this;
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                    $scope.qrCodeURL = 'http://chart.googleapis.com/chart?cht=qr&chs=300x300&choe=UTF-8&chld=H&chl=' + encodeURIComponent(tabs[0].url);
                    $scope.$apply();
                    $mdDialog.show({
                        controller: that.DialogController,
                        templateUrl: 'dialog.tmpl.html',
                        parent: angular.element(document.querySelector('#popupContainer')),
                        targetEvent: ev,
                        clickOutsideToClose:true
                    });
                });

            },
            'DialogController': function($scope, $mdDialog) {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    $scope.qrCodeURL = 'http://chart.googleapis.com/chart?cht=qr&chs=300x300&choe=UTF-8&chld=H&chl=' + encodeURIComponent(tabs[0].url);
                });
                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.answer = function(answer) {
                    $mdDialog.hide(answer);
                };
            }
        },
        getPlayerInfo: {
            'buttonName': 'Get Player Info',
            'action': function() {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, {action: "getPlayerInfo"}, function(response) {});
                });
            }
        }
    }
    $scope.tabs = {
        titles: ['Tickets', 'Scripts'],
        salesForce: {
            'text': 'Open Salesforce Ticket',
            'buttonName': 'SF',
            'appearsInTab': 1,
            'model': '',
            'action': function() {
                if (typeof this.model !== 'undefined') {
                    var url = 'https://na5.salesforce.com/_ui/search/ui/UnifiedSearchResults?searchType=2&sen=a1d&sen=a0S&sen=00a&sen=005&sen=001&sen=500&sen=003&str=' + this.model;
                    window.open(url, '_blank');
                }
            },
        },
        openJira: {
            'text': 'Search for a JIRA ticket',
            'buttonName': "JIRA",
            'appearsInTab': 0,
            'model': '',
            'action': function() {
                if (typeof this.model !== 'undefined') {
                    var url = 'https://kaltura.atlassian.net/browse/' + this.model;
                    window.open(url, '_blank');

                }
            },
        },
        convertEpoch: {
            'text': "Convert UNIX to GMT",
            'appearsInTab': 1,
            'buttonName': 'Convert',
            'model': '',
            'action': function() {
                var utcSeconds = this.model;
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(utcSeconds);
                this.model = d;
            }
        },
        getKs: {
            'text': "Grab KS From KMC",
            'appearsInTab': 0,
            'buttonName': 'KS',
            'model': '',
            'action': function() {
                var that = this;
                var id = '#' + this.buttonName;
                var el = angular.element($(id));

                //send message from browser_action(popup window) to content_script(inject.js) to display prompt with the ks.
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, {action: "getKs"}, function(response) {
                        $scope.$apply(function() {
                            if (response)
                                that.model = response.ks["kmc.vars.ks"];
                        });
                        $(el).select();
                        document.execCommand('copy');
                    });
                });
            }
        }
    };
});





var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-74364367-2']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();




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
    scope.tabs.getKs.action();
});

