
var settings = new Store('settings');
var text = settings.get('template');
if (text === undefined) {
    settings.set('template', i18n.get("template_text"));
    text = settings.get('template');
}
var template = parseTemplate(text);


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting == "hello")
            sendResponse({farewell: "goodbye"});
    });

chrome.commands.onCommand.addListener(function(command) {
    if (command === 'add-template') {
        return chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {
                action: command,
                template: parseTemplate(settings.get('template'))
            }, function(response) {});
        });
    }
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.duplicate(tabs[0].id);
    });
});
function updateAddress(tabId) {
    chrome.tabs.sendRequest(tabId, {}, function(address) {
        addresses[tabId] = address;
        if (!address) {
            chrome.pageAction.hide(tabId);
        } else {
            chrome.pageAction.show(tabId);
            if (selectedId == tabId) {
                updateSelected(tabId);
            }
        }
    });
}
function parseTemplate(template) {
    return template.replace(/{(username)}/g, settings.get('username'));

}


var requestFilter = {
    urls: [ "https://*.salesforce.com/*" ],
    types: ["xmlhttprequest"]
};
//add event listener to xhr requests with filter specific to salesforce.com to opmtize performance.
chrome.webRequest.onCompleted.addListener( handler, requestFilter);

function handler(details) {

    //Once a xhr request is completed in saleforce a message is sent to content script(inject.js)
    // giving the OK to start replacing links in page
    chrome.tabs.sendMessage(details.tabId, {action: "findJiraField"}, function(response) {});
    chrome.tabs.sendMessage(details.tabId, {action: "salesforceLoaded"}, function(response) {});


}



chrome.tabs.getSelected(null,function(tab) {
    var tablink = tab.url;

});

chrome.contextMenus.create({
    "title": "Player Stats",
    "contexts": ["video", "frame"],
    "onclick" : function(info,tab) {
        chrome.tabs.executeScript(null, {file: "/bower_components/jquery/dist/jquery.min.js"});
        chrome.tabs.insertCSS(null, {
            file: '/css/injectStyles.css'
        });
        chrome.tabs.executeScript(null, {file: "/src/inject/inject.js"}, function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {action: "getPlayerInfo"}, function(response) {});
            });
        });

    }
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-74364367-2']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();