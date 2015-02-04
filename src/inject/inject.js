$(document).ready(function() {

	(function() {

		//only execute the code below if the location is in salesforce.
		var currentLocation = document.URL;
		var pattern = /salesforce/;
		if (pattern.test(currentLocation)) { 
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
					}, 5000);
				
			
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
				$('#issuetype-field').focus();
				$('[name="Next"]').trigger('click');				
				$('#customfield_10101').val(items.caseData.accountName); //set account name field
				$('#customfield_10102').val(items.caseData.caseNumber); //set the case number field
				$('#customfield_10600').val(items.caseData.caseURL); //set SF Case Link field
				if (items.caseData.priority === 'High') {
					$('#priority-field').val('2-' + items.caseData.priority);
				} else {
					$('#priority-field').val('2-' + items.caseData.priority);
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
