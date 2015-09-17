
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.greeting == "hello")
        sendResponse({farewell: "goodbye"});
    });

chrome.commands.onCommand.addListener(function(command) {
 chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.create({
    url: tabs[0].url,
    index: tabs[0].index +1
  });
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
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
           chrome.tabs.sendMessage(tabs[0].id, {action: "getPlayerInfo"}, function(response) {});  
        });
    }
  });

