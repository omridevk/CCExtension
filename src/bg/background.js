
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
          "from the extension");
      if (request.greeting == "hello")
        sendResponse({farewell: "goodbye"});
    });


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
      console.log('Select link: ' + info.selectionText);
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
           chrome.tabs.sendMessage(tabs[0].id, {action: "getPlayerInfo"}, function(response) {});  
        });
    }
  });

