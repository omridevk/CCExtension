
// create an array of buttons with the correct href to be added later to the DOM.
// 1. check if there is an iframe (for backward compaitiblity with the new console)
// 2. set the variable to be the iframe document or the document itself.
// 3. find the last button.
// 4. replace it.
// 5. add other buttons after the last one is replaced.
// 6. add event listener to each new button.
// 7. init the object.
var CCEXT = {
	
			CustomButtons: {
			defualtConfig: {

				buttonsData: {
					"open_jira": {
						url: "https://kaltura.atlassian.net/secure/CreateIssueDetails!init.jspa?pid=10200&issuetype=9",
						text: "Open Jira",
					},

					"open_supps":{
						url: "https://kaltura.atlassian.net/secure/CreateIssueDetails!init.jspa?pid=12201&issuetype=9",
						text: "Open SUPPS"
					}, 
					"open_akamai":{
						url: "https://control.akamai.com/resolve/charaka/CharakaServlet?action=open&requestType=nonPS&category=Technical%20Support_technical.support",
						text: "Open Akamai Ticket"
					},
					"open_feature_request":{
						url:"https://kaltura.atlassian.net/secure/CreateIssueDetails!init.jspa?pid=10200&issuetype=4",
						text: "Open Feature Request"
					} 
				}	
			},
			init: function() 
			{
				this.setMasterDocument();
				this.createButttons();
				this.replaceButtons();
			},
			setMasterDocument: function() 
			{
				var iframe = document.getElementsByTagName('iframe')[1];
				// checking if the iframe id starts with "ext-comp" string which means that we are using the new console.
				// otherwise set this.innerDoc to root document.
				// if (typeof(iframe) !== 'undefined') 
				if (iframe.id.indexOf('ext-comp') !== -1)
				{
					return this.innerDoc = iframe.contentDocument || iframe.contentWindow.document;
				} 
				return this.innerDoc = document;
			},

			getLastButton: function()
			{
				return $(this.innerDoc).find('[name="open_jira"]');
			},

			createButttons: function()
			{
				var btns = [];
				var btnToCreateList = this.defualtConfig.buttonsData;
				var index = 0;
				for (var btn in btnToCreateList) {
					if (btnToCreateList.hasOwnProperty(btn)) {				
						var newButton = $('<input/>').attr({
							type: "button",
							id: btn + "" + index,
							src: btnToCreateList[btn].url,
							class: "btn custom " + "extensionBtn" + index,
							value: btnToCreateList[btn].text
						});
						index++;
						btns.push(newButton);
					}
				}
				return this.buttonsEls = btns;
			},
			replaceLastButton: function()
			{
				if ($(this.innerDoc).find('.extensionBtn0').length === 0) {
					return $(this.getLastButton()).replaceWith(this.buttonsEls[0]);
				}
				return false;
				// replace last button with the first button (open_jira)

			},
			replaceButtons: function()
			{
				
				this.replaceLastButton();
					if ( ! this.buttonsAdded()) {
						var btns = $(this.buttonsEls);
						var _this = this;
						$.each(btns[0], function( key, value ){
								for (var i=0; i < btns.length; i++) {
									if (btns[i][0].id !== "open_jira0") {
										$(_this.innerDoc).find('.extensionBtn0').after(btns[i]);
									}
								}	
						});
					}
			},
			buttonsAdded: function()
			{
				if ($(this.innerDoc).find('.extensionBtn1').length > 0) {
					return true;
				}
				return false;
			}
		}
}