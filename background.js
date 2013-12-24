/*This file handles all the background work such as polling the website for new information*/
//once dom is ready start the polling of the website
$(startRequest);
//instance variables used in popup.js and this file
var isLoggedIn = false;
var numOfMessages = 0;
var content="";
var username = "";

//polls the terms page as it is static to determine if the user is logged and therefore if they have any new messages
function getUnreadCount(callback) {
	$.get( "https://luscious.net/terms", function( data ) {
		var loggedIn = $( data).find('#unstickyheader .user_btn.right li').length === 3;
		var numberOfMessages = $(data).find('#stickyheader ul.second_panel li:first').text().trim();
		var unreadCount = (numberOfMessages==='')?'X':numberOfMessages ;
		//returns the data to the callback function
	 	callback(loggedIn,unreadCount);
	});
}

//initiates the getUnreadCount function and sets the badge of the extension to the number of unread messages or X if not logged in
function updateBadge() {
	getUnreadCount(function(loggedIn,unreadCount){
		isLoggedIn = loggedIn;
		numOfMessages = unreadCount;
		chrome.browserAction.setBadgeText({text:unreadCount});
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

var pollInterval = 1000 * 20; // poll every 20 secs, should not be less than 10 secs as advised by admin

function loggedIn(){
	return isLoggedIn;
}


function startRequest() {
  updateBadge();
  updateMessages();
  window.setTimeout(startRequest, pollInterval);
}

function stopRequest() {
  window.clearTimeout(timerId);
}