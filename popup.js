/*This files is used to update the popup page each second*/
//get the background page to be able to access the variables within
var bkg = chrome.extension.getBackgroundPage();
//popup dom ready
$(function() {
    //check whether the user is logged in or not to determine to show which content
    if(bkg.loggedIn()){
         $('#signIn').hide();
         $('.content').show();
         
    }else{
        $('#signIn').show();
        $('.content').hide();
    }
    //start the polling of checking the content in background page
    startRequest();
});

var pollInterval = 1000 ; // every second, probably can be extended as the background polling is done every 20 secs
//update the messages part of the popup
function updateMessages(){
    //access the username from background
    $('.username').html(bkg.username);
    //remove the Hi string from the username
    $('.username span:last').text( $('.username span:last').text().substr(2));
    $('.notification .text').text(bkg.notifications);
    //access the content variable which contains the html for the messages div
    $('.content .messages').html(bkg.content);
    chrome.browserAction.setBadgeText({text:bkg.numOfMessages});
}

function startRequest() {
    updateMessages();
    window.setTimeout(startRequest, pollInterval);
}

function stopRequest() {
  window.clearTimeout(timerId);
}