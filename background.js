/*This file handles all the background work such as polling the website for new information*/
//once dom is ready start the polling of the website
$(startRequest);
//instance variables used in popup.js and this file
var isLoggedIn = false;
var numOfMessages = "0";
var content="";
var username = "";
var notifications= "0";

//polls the terms page as it is static to determine if the user is logged and therefore if they have any new messages
function getUnreadCount() {
	$.get( "https://luscious.net/api/user/info/", function( data ) {
		var json = jQuery.parseJSON(data);
		isLoggedIn =  (json.user) !== "Anonymous";
		notifications = json.no_noti.toString();
		numOfMessages = (!isLoggedIn)? "X": json.no_pms.toString();
		chrome.browserAction.setBadgeText({text:numOfMessages});
	});
}

//polls the inbox page to find the unread messages and creates the content for the popup
function updateMessages(){
	content = "";
	$.get( "https://luscious.net/messages/inbox", function( data ) {
		username = $(data).find("#hello").html();
		var $unreadMessages = $(data).find("li:contains('Unread') div.content");
		numOfMessages = $unreadMessages.length;
		$unreadMessages.each(function(index){
			var title = $(this).find('div.title a');
			title.attr('href',"https://luscious.net"+title.attr('href'));
			title.attr('target', "_blank");
			var participants= [];
			$(this).find('div.info ul.participants li').each(function(index){
				participants.push($(this).text().toUpperCase());
			});
			content+= $("<div/>").append($("<div/>").addClass('message').append(title).append($('<p/>').text("Chatting with: "+participants.join(',')))).html();
		});
	});
}

var pollInterval = 1000 * 10; // poll every 10 secs, should not be less than 10 secs as advised by admin

function loggedIn(){
	return isLoggedIn;
}


function startRequest() {
  getUnreadCount();
  updateMessages();
  window.setTimeout(startRequest, pollInterval);
}

function stopRequest() {
  window.clearTimeout(timerId);
}