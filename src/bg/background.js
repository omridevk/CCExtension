// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
          "from the extension");
      if (request.greeting == "hello")
        sendResponse({farewell: "goodbye"});
    });

// chrome.tabs.onActiveChanged.addListener (
//   function(info) {
//     var tabId = info.tabId,
//       windowId = info.windowId;
//       console.log(tabId);
//   });

// function getCurrentTabUrl(callback) {
//   // Query filter to be passed to chrome.tabs.query - see
//   // https://developer.chrome.com/extensions/tabs#method-query
//   var queryInfo = {
//     active: true,
//     currentWindow: true
//   };
//   console.log(queryInfo);
// }

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

