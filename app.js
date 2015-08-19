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

myApp.controller('customerCareCtrl', function ($scope) {

    Foundation.global.namespace = '';
    $scope.activeFoundation = $(document).foundation();
    $(function () {
        $('[data-toggle="popover"]').popover()
    });

    $scope.popUp = {

        getKs: function() {
            var that = this;
            //send message from browser_action(popup window) to content_script(inject.js) to display prompt with the ks.
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {action: "getKs"}, function(response) {
                    $scope.$apply(function() {
                        if (response)
                            that.ks = response.ks["kmc.vars.ks"];
                        // $("#joyrideDiv").foundation('joyride', 'start');

                    });
                    $('#ks-input-box').select();
                    document.execCommand('copy');

                });
            });
        },
        openSalesforce: function() {
            if (typeof this.salesForce !== 'undefined') {
                var url = 'https://na5.salesforce.com/_ui/search/ui/UnifiedSearchResults?searchType=2&sen=a1d&sen=a0S&sen=00a&sen=005&sen=001&sen=500&sen=003&str=' + this.salesForce;
                window.open(url, '_blank');
            }
        },
        openJira: function() {
            if (typeof this.jira !== 'undefined') {
                var url = 'https://kaltura.atlassian.net/browse/' + this.jira;
                window.open(url, '_blank');

            }
        },
        displayURLQRCode: function() {
            document.getElementById('spinner').style.display = 'block';
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                document.getElementById('spinner').style.display = 'none';
                $scope.qrCodeImgSrc = 'http://chart.googleapis.com/chart?cht=qr&chs=300x300&choe=UTF-8&chld=H&chl=' + encodeURIComponent(tabs[0].url);
                $scope.$apply();
            });
        },
        getPlayerInfo: function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {action: "getPlayerInfo"}, function(response) {});
            });
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
    scope.popUp.getKs();
});

