/*!
 * filename: inject.js
 * Kaltura Customer Care's Chrome Extension
 * 0.0.20
 *
 * Copyright(c) 2015 Omri Katz <omri.katz@kaltura.com>
 * MIT Licensed. http://www.opensource.org/licenses/mit-license.php
 *
 * http://corp.kaltura.com
 */

(function() {

	"use strict";

	// Type of tickets to add href to. 
	var options = ["SUP-", "PLAT-", "FEC-", "SUPPS-", "KMS-", "F-CS"];


	
	var CCEXT = {


		init: function() {
			var _this = this;
			this.addListeners();
			this.autoFillJira();
			// TODO: Add remove status such as Closed - Resolved from Salesforce.
			// this.removeStatusSalesforce();
			$(window).resize(function() {
				
					_this.findJiraField;
				
			});
		},
		addTemplate: function(template) {
			template = this.replaceCustomerName(template);
			var textArea = document.getElementById('pg:addCommentF:addCommentPB:rptOrder:0:addCommentPBS:addCommentPBSI:Comment_TextArea');
			$(textArea).val(template);
		},
		replaceCustomerName: function(template) {
			var customerName = this.getCustomerNameFromPage();
			return template.replace(/{(client)}/, customerName);
		},
		getCustomerNameFromPage: function() {
			var checkBox = document.getElementById('pg:addCommentF:addCommentPB:rptOrder:2:emailCustomerPBS:emailCustomerPBSI:EmailCustomer_Checkbox');
			var el = checkBox.parentNode;
			if (checkBox === null) {
				return '';
			}
			if (checkBox.disabled) {
				var el = document.getElementById('pg:addCommentF:addCommentPB:rptOrder:2:emailCustomerPBS:contactRolesPBSI:contactRoles_Checkbox:0').nextElementSibling;
			}

			var customerName = el.innerText.split(' ');
			if (customerName[0].length === 0) {
				return this._capitalizeFirstLetter(customerName[1]);
			}
			return this._capitalizeFirstLetter(customerName[0]);


		},
		_capitalizeFirstLetter: function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		},
        commentSize: 30,
		

		addListeners: function()  {
			var _this = this;

			chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
				if (msg.action === 'add-template') {
					return _this.addTemplate(msg.template);
				}
				if (msg.action === 'getKs' && (location.host === "kmc.kaltura.com")) {
					var windowVariables = _this.retrieveWindowVariables(["kmc.vars.ks"]);
					sendResponse({ks: windowVariables});
				} else if (msg.action === 'getPlayerInfo') {
					_this.injectScript(_this.getPlayerInfo);
				} else if (msg.action === "findJiraField") {
					
					_this.findJiraComment();
					// _this.addButtons();
					_this.CustomButtons.init();
					_this.findJiraField();
				}
			});

			chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
			
				
			});
		},

		// Listening to events that comes from the popup window, and execute function based on the action chosen in the popup.js
		


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
				this.addListeners();
			},
			setMasterDocument: function() 
			{
				var _this = this;
				
				// 1. find the active tab.
				// 2. get the ticket number from it
				// 3. Itteriate through all the iframe that has id ext-comp.
				// 4. look for each iframe if there the ticket number equels the ticket number of the active tab.
				// 5. if it is set that iframe as the root document otherwise set the page as the document(backward compaitiblity)
				var activeTab = findActiveTab();
				getIframe(activeTab);
				addListenerToTab(activeTab);


				function getIframe(activeTab) 
				{
					var tab = {};
					var containers = $('.sd_secondary_container');
					$.each(containers, function(key, value) {
						if (! $(value).hasClass('x-hide-display')) {
							tab = value;
						}
					});


					//setButtonsLayOut();
					return _this.innerDoc = document;
				}
				function setButtonsLayOut() {
					var title = $('.mainTitle')[0];
					if (typeof(title) !== 'undefined') {
						$(title.parentNode).css("width", "30px");
					}
				}
				function findActiveTab() 
				{
					// relevant active tab should always be second in the array of active tabs.

					 return $(".x-tab-strip-active:visible")[1];
					
				}

				function addListenerToTab(activeTab)
				{
					$(activeTab).click(function() {
						_this.init();
					});
				}
				
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
			},
			addListeners: function()
			{
				var _this = this;
				$(this.innerDoc).find('.custom').click(function(event) {

					var caseData = _this.saveTicketInformation();		
				    chrome.storage.local.set({'caseData': caseData}, function() {
				    	var url = event.target.getAttribute('src');
						var myWindow = window.open(url, "myWindow", "width=600, height=600");    // Opens a new window
						myWindow.focus();

					});	
				});
			},

			saveTicketInformation: function(btnId) {
				var caseData = {};
				caseData.caseURL = this.innerDoc.getElementById('00N70000003iS5n_ileinner').innerText;
				

				caseData.div = $(this.innerDoc).find('#cas2_ileinner');
				chrome.storage.local.clear();
				caseData.caseNumber = caseData.div[0].innerHTML;
				caseData.btnId = btnId;
				caseData.accountName = $(this.innerDoc).find('#cas4_ileinner')[0].innerText; 
				caseData.priority = $(this.innerDoc).find('#cas8_ileinner')[0].innerText;
				caseData.accountClass = $(this.innerDoc).find('#00N70000002RDrn_ileinner')[0].innerText;
				// caseData.caseURL = document.URL;
				// Adding a fix for the new Salesforce console.
				// Need to find the div that contains the URL for the salesforce ticket.
				// Since the new Console puts everything within an iframe.
				// Need to first find the iframe, then get the div with case link URL.

				// find the iframe for the new salesforce console.	
				// Always assumes that the relevant iframe is in the second spot.
					
				return caseData;
			}
		},

		// Inject script tag and its content to a page in order to access the page JavaScript variables. 
		// Choose which function to inject when calling the function.
		injectScript: function(func) {
			var script = document.createElement('script');
			script.appendChild(document.createTextNode('('+ func +')();'));
			(document.body || document.head || document.documentElement).appendChild(script);
		},

		// Looking for links in Salesforce ticket comments and turn then into click-able links
		findJiraComment: function () {
			$(this.CustomButtons.innerDoc).find('.dataCell').each(function () {
				this.innerHTML = Autolinker.link( this.innerHTML, {stripPrefix: false} );
				var pattern = /Link:/;
			});
		},


		// Iterating over each ticket type options and turn it to a clickable link.
		findJiraField: function () {
			var els = {};
            var _this = this;

			for (var i = 0; i < options.length; i++) {
				$(this.CustomButtons.innerDoc).find('div:contains("' + options[i] + '")').each(function () {
					if (!$(this).find('a').length) {
                        if (_this.commentFieldSize(this, _this.commentSize)) {
                            var jiraNumber = this.innerText;
                            $(this).empty();

                            jiraNumber = jiraNumber.split(",");
                            for (var j = 0; j < jiraNumber.length; j++) {
                                jiraNumber[j] = jiraNumber[j].replace(' ', '');
                                if (jiraNumber[j].indexOf(',') != -1) {
                                    jiraNumber[j] = jiraNumber[j].replace('\,', '');
                                }
                                var link = options[i] === "F-CS" ?
                                "https://control.akamai.com/resolve/caseview/caseDetails.jsp?caseId=" + jiraNumber[j] :
                                "https://kaltura.atlassian.net/browse/" + jiraNumber[j];
                                var newLink = $("<a />", {
                                    name: "link",

                                    target: "_blank",
                                    href: link,
                                    text: jiraNumber[j] + " "
                                });
                                $(this).append(newLink);
                            }
                        }
					}
				});
			}
		},

        commentFieldSize: function(el, commentSize) {

            if (el.innerHTML.length < commentSize)
            {
                return true;
            }
            return false;
            /* check if length of the element is less than 20 - selected a small number like 20
                this will ensure that we only replacing the JIRA field, since I am looking for any field that has SUP
                inside it, some the parents are also returned, thus need to make sure that we only replace the child element
                * if size is smaller than 20, we can go ahead and check
             */
        },

		

		autoFillJira: function() {
			if (document.URL.indexOf('CreateIssue') !== -1) { 
				//execute script if open JIRA page is loaded
			    chrome.storage.local.get(null, function(items) { 
			    	if (document.URL.indexOf('init') !== -1) {
			    		$('.error').hide();
			    	}
					var allKeys = Object.keys(items);	
					$('#customfield_10101').val(items.caseData.accountName); //set account name field
					$('#customfield_10102').val(items.caseData.caseNumber); //set the case number field
					$('#customfield_10600').val(items.caseData.caseURL); //set SF Case Link field
					$('#customfield_10303').val(10416);
					$('option:selected', 'select[name="priority"]').removeAttr('selected');
					if (items.caseData.priority === 'High') { //Set Ticket high priority
						 $('#priority-field').val('2-' + items.caseData.priority);
						 $('[name=priority]').val( 12 );
						 $('.aui-ss-entity-icon').attr('src', 'https://kaltura.atlassian.net/images/icons/priority_critical.gif');
					} else if (items.caseData.priority === 'Medium') {
						$('[name=priority]').val( 13 );
						$('#priority-field').val('3-' + items.caseData.priority, true);
						$('.aui-ss-entity-icon').attr('src', 'https://kaltura.atlassian.net/images/icons/priority_major.gif');
					} else if (items.caseData.priority === 'Low') {
						$('[name=priority]').val( 14 );
						$('#priority-field').val('3-' + items.caseData.priority);
						$('.aui-ss-entity-icon').attr('src', 'https://kaltura.atlassian.net/images/icons/priority_minor.gif');
					} else {
						$('[name=priority]').val( 15 );
						$('.aui-ss-entity-icon').attr('src', 'https://kaltura.atlassian.net/images/icons/priority_minor.gif');
					}
					 //set SF Case Link field
					
					//Check for Class of service
					if (items.caseData.accountClass === "Platinum") {
						$('#customfield_10103-1').prop('checked',true);
					} else if (items.caseData.accountClass === "Gold") {
						$('#customfield_10103-2').prop('checked',true);
					} else if (items.caseData.accountClass === "Silver") {
						$('#customfield_10103-3').prop('checked',true);
					} else {
						$('#customfield_10103-3').prop('checked', true);
					}
				});	
			}
		},

		removeStatusSalesforce: function() {

			$('#cas7_ilecell').click(function() {
				removeStatus();
			});
			function removeStatus() {
				$('#cas7').children().each(function() {
					if ($(this).html() === "Closed - Resolved")
					{
						$(this).hide();
					}
				})
			}			
		},


		retrieveWindowVariables: function(variables) {
		    var ret = {};

		    var scriptContent = "";
		    for (var i = 0; i < variables.length; i++) {
		        var currVariable = variables[i];
		        scriptContent += "if (typeof " + currVariable + " !== 'undefined') $('body').attr('tmp_" + currVariable + "', " + currVariable + ");\n"
		    }

		    var script = document.createElement('script');
		    script.id = 'tmpScript';
		    script.appendChild(document.createTextNode(scriptContent));
		    (document.body || document.head || document.documentElement).appendChild(script);

		    for (var i = 0; i < variables.length; i++) {
		        var currVariable = variables[i];
		        ret[currVariable] = $("body").attr("tmp_" + currVariable);
		        $("body").removeAttr("tmp_" + currVariable);
		    }

		    $("#tmpScript").remove();

		    return ret;
		},


		//collect player information and add an overlay div on the player to display the information.
		getPlayerInfo: function() {
			if (typeof(kWidget) !== "undefined") {
				var playerInformation = {};
				var options = {};

				var bytesToSize = function(bytes) {
				   	if(bytes == 0) return '0 Byte';
					   var k = 1000;
					   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
					   var i = Math.floor(Math.log(bytes) / Math.log(k));
					   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
				};
				var streamingType = function(streamingType) {
					if (streamingType === "hdnetworkmanifest") {
						streamingType = "HTTP Streaming(HDS)";
					} else if (streamingType === "hdnetwork") {
						streamingType = "HTTP Streaming(Akamai)";
					} else if (streamingType === "http") {
						streamingType = "HTTP Progressive Download";
					} else if (streamingType === "rtmp") {
						streamingType = "RTMP";
					} else if (streamingType === "auto") {
						streamingType = "Auto";
					} else {
						streamingType = "RTMPE Streaming";
					}
					return streamingType;
				};


				kWidget.addReadyCallback(function( playerId ){
					var kdp = document.getElementById( playerId );
					options.playerDivId = kdp;
					// playerInformation["Play Manifest"] = kdp.evaluate('{mediaProxy.entry.dataUrl}');
					playerInformation["Partner Id"] = kdp.evaluate('{mediaProxy.entry.partnerId}');
					playerInformation["Entry Name"] = kdp.evaluate('{mediaProxy.entry.name}');
					playerInformation["Entry Id"] = kdp.evaluate('{mediaProxy.entry.id}');
					playerInformation["Volume"] = kdp.evaluate('{video.volume}') * 100 + "%";
					
					playerInformation["Streaming Type"] = streamingType(kdp.evaluate('{configProxy.flashvars.streamerType}'));
					playerInformation["UiConf Id"] = kdp.evaluate('{configProxy.kw.uiConfId}');
					playerInformation["Player Version"] =  preMwEmbedConfig.version;
					playerInformation["Downloaded"] = '0 MB';
					
					kdp.kBind("bytesDownloadedChange.bytesChanged", function( data, id ){
						if (isNaN(data.newValue)) {
							kdp.kUnbind('.bytesChanged')
						}
						updateDownloadedLabel(data);
					});
					kdp.kBind("volumeChanged.bytesChanged", function( data, id ){
						var volume = data.newVolume * 100;
						updateVolumeLabel(volume)
					});
				});
				

				//create a temp div within a website with text that contain JSON from object that is inaccessible to inject.js
				var tempDiv = $("<div>", {
					id:"tmpDiv",
					css: {
						"display":"none"
					},
					text: JSON.stringify(playerInformation)
				}).appendTo('body');

				var updateVolumeLabel = function(data) {
					var td = $("<td>", {
							id: "volumeLabel",
							text: data + "%"
					});
					$('#volumeLabel').replaceWith(td);
				};

				var updateDownloadedLabel = function(data) {			
					data.newValue = (isNaN(data.newValue)) ? "Only HTTP Streaming type is currently supported" : bytesToSize(data.newValue);
					if ($('#downloadedBytes').length) {

						var td = $("<td>", {
							id: "downloadedBytes",
							text: data.newValue
						});
						$('#downloadedBytes').replaceWith(td);	
					} else {
						$("<p>", {
							id: "downloadedBytes",
							text:"Downloaded:" + data.newValue
						}).appendTo('#panelBox');
					}
				};

				
				var playerPosition = (options.playerDivId) ? options.playerDivId.getBoundingClientRect() : undefined;
				// get the scroll position from the top in pixels.
				var scrollPosition = $(window).scrollTop();
				
				if (!$('#panelBox').length) {
					$("<div>", {
						id: "panelBox",
						class: "extensionPanel",
						css: {
							"height": playerPosition.height/1.5,
							"width" : playerPosition.width / 1.5,
							"top": playerPosition.top + scrollPosition + 15,
							"bottom": playerPosition.bottom,
							"left": playerPosition.left + 15,
							"right": playerPosition.right
						}
					}).appendTo('body');
					$("<span>", {
						id: "closeBtn",
						class: "boxclose",
						css: {
							"position" : "absolute",
							"right" : "18px",
							"top" : "20px",
							"cursor": "pointer"
						}
					}).appendTo('#panelBox');
					$('#closeBtn').click(function() {
						$('#panelBox').hide();
					});

					$.each(playerInformation, function(key, value) {
						var tbl = $('<table></table>');
					    var row = $('<tr></tr>').attr({ class: ["panelTabel"].join(' ') }).appendTo(tbl);
					    $('<td class="customTd"></td>').text(key + " : ").appendTo(row);
					    if (key === "Downloaded") {
					    	$('<td id="downloadedBytes"></td>').text(value).appendTo(row);        	
					    } else if (key === "Volume") {
					    	$('<td id="volumeLabel"></td>').text(value).appendTo(row); 
					    } else {
					    $('<td></td>').text(value).appendTo(row);        
						}
					    tbl.appendTo($("#panelBox"));   
					});

				} else {
					$('#panelBox').show();
				}
			}
		}
	}

	CCEXT.init();

})();
