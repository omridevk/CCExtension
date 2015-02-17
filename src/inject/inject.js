/*!
 * filename: inject.js
 * Kaltura Customer Care's Chrome Extension
 * 0.0.1
 *
 * Copyright(c) 2015 Omri Katz <omri.katz@kaltura.com>
 * MIT Licensed. http://www.opensource.org/licenses/mit-license.php
 *
 * http://corp.kaltura.com
 */

$(document).ready(function() {
	var options = ["SUP-", "PLAT-", "FEC-", "SUPPS-", "KMS-", "F-CS"];

	function main () {
	  // ...
		var testius = document.getElementsByTagName('iframe')[0];
		if (typeof kmc != 'undefined' ) {
			var t = kmc.vars.ks;
			console.log(t);
			console.log(testius.contentWindow.kalturaIframePackageData);
		  // ...
		}
	}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");
		if (request.greeting == "hello")
			sendResponse({farewell: "goodbye"});
});




	var script = document.createElement('script');
	script.appendChild(document.createTextNode('('+ main +')();'));
	(document.body || document.head || document.documentElement).appendChild(script);
	

	var findJiraComment = function() {
		setTimeout(function() {
			$('td:contains("Created By")').each(function () {
			if (this.innerText.length > 140 && this.innerText.length < 450) {
				this.innerHTML = Autolinker.link( this.innerHTML );
				var pattern = /Link:/;
				if (pattern.test(this.innerText)) {
				}
			}
		});
		}, 1500);	
	};

	var findJiraField = function() {
		setTimeout(function() {
		var currentLocation = document.URL;
		var pattern = /salesforce/;
		if (pattern.test(currentLocation)) {
			var els = {};
			for (var i = 0; i < options.length; i++) {
				$('div:contains("' + options[i] + '")').each(function () {
					$(document).ready(findJiraComment).delay(400);
					var editCommentClass = $(this).attr("class");
					if (this.innerText.length < 30 && editCommentClass != "pbSubsection" && editCommentClass != "requiredInput") {
						var jiraNumber = this.innerText;
						$(this).empty();
						jiraNumber = jiraNumber.split(",");
						for (var j = 0; j < jiraNumber.length; j++) {
							jiraNumber[j] = jiraNumber[j].replace(' ', '');
							if (jiraNumber[j].indexOf(',') != -1 ) {
								jiraNumber[j] = jiraNumber[j].replace('\,', '');
							}
							var link = options[i] === "F-CS" ? "https://control.akamai.com/resolve/caseview/caseDetails.jsp?caseId=" + jiraNumber[j] : "https://kaltura.atlassian.net/browse/" + jiraNumber[j];
							var newLink = $("<a />", {
								name: "link",
								target: "_blank",
								href: link,
								text: jiraNumber[j] + " "
							});
							$(this).append(newLink);
						}
					}
				});
			}
		}
		}, 1500);
	};

	chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
		if (response.farewell == "goodbye")
			findJiraComment();
			findJiraField();
			$(window).resize(findJiraField);
		});

	(function() {
		//only execute the code below if the location is in salesforce.
		var currentLocation = document.URL;
		var pattern = /salesforce/;
		if (pattern.test(currentLocation)) { 
			//findJira();
			var caseData = {};
			caseData.div = $('#cas2_ileinner');
			if (caseData.div.length > 0) {
				chrome.storage.local.clear();
				caseData.caseNumber = caseData.div[0].innerHTML;
				caseData.accountName = $('#cas4_ileinner')[0].innerText; 
				caseData.priority = $('#cas8_ileinner')[0].innerText;
				caseData.accountClass = $('#00N70000002RDrn_ileinner')[0].innerText;
				caseData.caseURL = document.URL;
			    chrome.storage.local.set({'caseData': caseData});
			}
		}
	})();

	(function() {
		var currentLocation = document.URL;
		var pattern = /admin/;
		var hint = $('.hint');
		if (pattern.test(currentLocation)) {
			if ($('#password')[0] != undefined && hint.length < 1) {
				setTimeout(
					function()
					{
						var z = document.getElementById("submit").click();
					}, 200);
			}
		}
	})();

	if (document.URL === 'https://kaltura.atlassian.net/secure/CreateIssue.jspa') { 
		//execute script if open JIRA page is loaded
		(function() {
		    chrome.storage.local.get(null, function(items) {    	
				var allKeys = Object.keys(items);
				$('#project-field').val('Support (SUP)');
				$('#issuetype-field').val('Ticket').delay(100);
				//focus issue field type - making sure that when clicking next the field will use the auto-complete
				$('#issuetype-field').focus(); 
				$('[name="Next"]').trigger('click');	//click next for user when creating a new jira			
				$('#customfield_10101').val(items.caseData.accountName); //set account name field
				$('#customfield_10102').val(items.caseData.caseNumber); //set the case number field
				$('#customfield_10600').val(items.caseData.caseURL); //set SF Case Link field
				$('option:selected', 'select[name="priority"]').removeAttr('selected');
				if (items.caseData.priority === 'High') { //Set Ticket high priority
					 $('#priority-field').val('2-' + items.caseData.priority);
					 $('[name=priority]').val( 12 );
				} else if (items.caseData.priority === 'Medium') {
					$('[name=priority]').val( 13 );
					$('#priority-field').val('3-' + items.caseData.priority, true);
				} else if (items.caseData.priority === 'Low') {
					$('[name=priority]').val( 14 );
					$('#priority-field').val('3-' + items.caseData.priority);
				} else {
					$('[name=priority]').val( 15 );
				}
				 //set SF Case Link field
				
				//Check for Class of service
				if (items.caseData.accountClass === "Platinum") {
					$('#customfield_10103-1').prop('checked',true);
				} else if (items.caseData.accountClass === "Gold") {
					$('#customfield_10103-2').prop('checked',true);
				} else {
					$('#customfield_10103-3').prop('checked',true);
				}
			});   
		})(); 	
	}
});
