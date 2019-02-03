//https://oauth.vk.com/authorize?client_id=6818569&display=page&scope=friends,status,messages,offline&response_type=token&v=5.52

var state = setInterval(documentLoad, 100);
var point;

// Что бы при загрузке по умолчанию была открыта вкладка "Message"
menu (0);  

// Обрабатывает загрузку страницы и убирает лого
function documentLoad(){
	if (document.readyState == 'complete') {
		$(".loadDocument").css("display", "none");
		clearInterval(state);
	}
}

document.querySelector("#menu_list").onclick   = () => document.querySelector('.list_search').style.display = 'flex';
document.querySelector(".list_search").onclick = () => document.querySelector(".list_search").style.display = 'none';
document.querySelector("#remove_list").onclick = () => document.querySelector(".list_search").style.display = 'none';

// Обрабатывает работу меню в сайдбаре
function menu (pointer){
	document.querySelectorAll(".bottom_bar_menu > div")[pointer].style.borderBottom = "2px solid #72a7ff";
	document.querySelectorAll(".bottom_bar_menu > div")[pointer].style.color = "#3367d6";

	if (point == undefined) { point = pointer; messagesMenu(); return 0; }

	document.querySelectorAll(".bottom_bar_menu > div")[point].style.borderBottom = "1px solid #f4f4f4";
	document.querySelectorAll(".bottom_bar_menu > div")[point].style.color = "#4b4b4b";

	point = pointer;

	if (pointer == 0){
		$(".side_bar_messages_container").css("display","flex");
		$(".side_bar_friends_container").css("display","none");
		messagesMenu();
	}
	else if (pointer == 1){
		$(".side_bar_messages_container").css("display","none");
		$(".side_bar_friends_container").css("display","flex");
		friendsMenu();
	}
}

// Обрабатывает поиск в сайдбаре
$("#sidebar_search").keyup(function() {
	if (document.getElementById("sidebar_search").value == "")
		messagesMenu();
	else
		sendRequest("messages.searchConversations", {q: document.getElementById("sidebar_search").value, count: 15, extended: 1}, (data) => messageSearch(data.response));
});
function messageSearch (data) { // Функция обработки поиска
	if (data.count == 0) {
			$(".bottom_bar_content").html("<div class='search_false'><p>Dialogue not found!</p><p>Search in messages</p></div>");
		}
	else
		SearchConversationByName(data);

		function SearchConversationByName(m) { // Поиск переписок по названию диалога
			var html = "";
			var array = new Array();

			if ("items" in m) {
				for (var i=0; i < m.items.length; i++) {
					if (m.items[i].peer.type == "chat") {
						const name = m.items[i].chat_settings.title.length >= 25 ? m.items[i].chat_settings.title.slice(0, 25) + "..." : m.items[i].chat_settings.title;
						const photo = ("photo" in m.items[i].chat_settings) ? m.items[i].chat_settings.photo.photo_100  : "img/noImageForChat.png";
						html += "<div class='messageSearchContainer' data-id='" + m.items[i].peer.id + "'>" 
						+ "<img src='" + photo + "'>"
						+ "<p>" + name + "</p>"	
						+ "</div>";
					} 
				}
			}
			if ("profiles" in m) {
				for (var i=0; i < m.profiles.length; i++) {
					const name =  m.profiles[i].first_name.length > 28 ?  m.profiles[i].first_name.slice(0, 28) + "..." : m.profiles[i].first_name;
					html += "<div class='messageSearchContainer' data-id='" + m.profiles[i].id + "'>" 
					+ "<img src='" + m.profiles[i].photo_100 + "'>"
					+ "<p>" + name + " " + m.profiles[i].last_name + "</p>"	
					+ "</div>"; 
				}
			}
			if ("groups" in m) {
				for (var i=0; i < m.groups.length; i++) {
					const name = m.groups[i].name.length > 28 ? m.groups[i].name.slice(0, 28) + "..." : m.groups[i].name;
					html += "<div class='messageSearchContainer' data-id='" + m.groups[i].id + "'>" 
					+ "<img src='" + m.groups[i].photo_100 + "'>"
					+ "<p>" + name + "</p>"	
					+ "</div>";
				}
			}
			html += "<div class='messageSearchContainer'>"
			+ "<p>Search in messages</p>"
			+ "</div>";

			$(".bottom_bar_content").html(html);
			$(".messageSearchContainer").on("click", function (pElement) { drawMessageHistory($(pElement.currentTarget.attributes[1])) });
		}
}
function messagesMenu(){	
	
	sendRequest("messages.getConversations", { count: 10, extended: 1}, (data) => drawMessages(data.response));

	function drawMessages(m){
		var html = " ";
		var message = m.items ;//array в котором хранятся last_message и Conversation

		for (var i = 0, len = message.length; i < len; i++){
			if (message[i].conversation.peer.type == "user"){	
				var userId = message[i].conversation.peer.id;
				var unreadMessages = (message[i].conversation.unread_count == undefined) ? "" : message[i].conversation.unread_count;
				var style = (message[i].conversation.unread_count == undefined) ? "style='display: none'" : "style='display: block'";
				var lastMessage = message[i].last_message.text; 			
	  			var time = timeConverter(message[i].last_message.date);
	  			if (message[i].last_message.fwd_messages.length != 0) lastMessage = message[i].last_message.fwd_messages.length + " messages";
	  			else if (message[i].last_message.attachments[0] == undefined) messageType = "notFound";
	  			else lastMessage = "<span style='color: #4285f4; font-size: 14px'> [ "+ message[i].last_message.attachments[0].type + " ]</span>" + " " + message[i].last_message.text;
	  			
	  			//m.profile array где хранятся профайлы юзеров, в цикл проверяется id 
				for (var j = 0; j <  m.profiles.length; j++){
					if (m.profiles[j].id  == userId){
						userName = m.profiles[j].first_name + " " + m.profiles[j].last_name ;
						userImage = m.profiles[j].photo_100; 
						
						drawInHtml(userName, userImage, lastMessage, unreadMessages, style, time, userId);
					}
				}
			}
			else if(message[i].conversation.peer.type == "chat"){
				var chatName = message[i].conversation.chat_settings == undefined ? "no_title" : message[i].conversation.chat_settings.title;
				var chatImage = message[i].conversation.chat_settings.photo == undefined ? "img/noImageForChat.png" : message[i].conversation.chat_settings.photo.photo_100;  
				var unreadMessages = message[i].conversation.unread_count == undefined ? "" : message[i].conversation.unread_count;
				var style = message[i].conversation.unread_count == undefined ? "style='display: none'" : "style='display: block'";
				var lastMessage = message[i].last_message.text;			
	  			var time = timeConverter(message[i].last_message.date);
	  			var chatId = message[i].conversation.peer.id;
	  			var messageType;
	  			if (message[i].last_message.fwd_messages.length != 0) lastMessage = message[i].last_message.fwd_messages.length + " messages";
	  			if (message[i].last_message.attachments[0] == undefined && message[i].last_message.action == undefined) messageType = "notfound";
	  			else if (message[i].last_message.action != undefined) lastMessage = "<span style='color: #b82626; font-size: 14px'> [ " + message[i].last_message.action.type + " ]</span>";
	  			else lastMessage = "<span style='color: #4285f4; font-size: 14px'> [ " + message[i].last_message.attachments[0].type + " ]</span>" + " " + message[i].last_message.text;

				drawInHtml(chatName, chatImage, lastMessage, unreadMessages, style, time, chatId);
			}
			else if (message[i].conversation.peer.type == "group"){
				var chatName, chatImage;

				for (var k = 0; k < m.groups.length; k++){
					if (m.groups[k].id == message[i].conversation.peer.local_id) {
						chatName = m.groups[k].name;
						chatImage = m.groups[k].photo_100;
					}
				}
				var lastMessage = message[i].last_message.text;
				var unreadMessages = (message[i].conversation.unread_count == undefined) ? "" : message[i].conversation.unread_count;
				var style = (message[i].conversation.unread_count == undefined) ? "style='display: none'" : "style='display: block'";
				var time = timeConverter(message[i].last_message.date);
				var chatId = message[i].conversation.peer.id;
				if (message[i].last_message.fwd_messages.length != 0) lastMessage = message[i].last_message.fwd_messages.length + " messages";
	  			else if (message[i].last_message.attachments[0] == undefined) messageType = "notFound";
	  			else lastMessage = "<span style='color: #4285f4; font-size: 14px'> [ "+ message[i].last_message.attachments[0].type + " ]</span>" + " " + message[i].last_message.text;

				drawInHtml(chatName, chatImage, lastMessage, unreadMessages, style, time, chatId);
			}
			else new Error ("there is no support for this type of message yet");
			function timeConverter(UNIX_timestamp){
	  			var a = new Date(UNIX_timestamp * 1000);
	  			var b = new Date();
	  			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	  			var year = a.getFullYear() == b.getFullYear() ? "" : a.getFullYear();
	  			var month = months[a.getMonth()];
	  			
	  			//если собшения пришло сегодня то выводит только время собшения
	  			if (a.getDate() == b.getDate() && a.getMonth() == b.getMonth()){
	  				//var date = "";
	  				var hour = a.getHours();
	  				var min  = a.getMinutes();
	  				var time =  hour + ':' + min;	
	  			}// если оно пришло вчера то выводит только надпись вчера  
	  			else if (a.getDate() == (b.getDate() - 1) &&  a.getMonth() == b.getMonth()){
	  				var date = "yesterday";
	  				var time = 	date ;
	  			}// а если старое то только число и годб год в том случие если он не равен нашему году 
	  			else { 
	  				var date = a.getDate();
	  				var time = date + ' ' + month + ' ' + year ;
	  			}
	  			return time;
			}
			// функция ресует html для сайдбара 	
			function drawInHtml(name, img, lastMessage, unreadMessages, style, time, peer_id){
				html += "<div class='side_bar_messages_container' data-id='" + peer_id + "'data-name='" + name + "'>"
				  		+ "<div>"
							+ "<img src='" + img + "'alt='img_conversation' />"
						+ "</div>"
						+ "<div class='side_bar_messages_container_block2'>"
							+ "<p>" + name + "</p>"
							+ "<p>" + lastMessage + "</p>"
						+ "</div>"
						+ "<div>"
							+ "<p " + style + ">" + unreadMessages + "</p>"
							+ "<p>" + time + "</P>"
						+ "</div>"
					+ "</div>";
				$(".bottom_bar_content").html(html);
				$(".side_bar_messages_container").on("click", function (pElement) { console.log($(pElement.currentTarget.attributes)) });
				//$(".side_bar_messages_container").on("click", function (pElement) { drawMessageHistory($(pElement.currentTarget.attributes[1]), $(pElement.currentTarget.attributes[2])) });
			}
		}
	}
} 	
//функция для вызова список длрузей в сйдбаре при клике 
function friendsMenu (){	
	sendRequest('friends.search', { count: 20, fields: 'photo_100,status,online,last_seen' }, (data) => drawFriends(data.response));
	
	function drawFriends (f){
		var html = " ";
		var name, userImage, status, online, lastSeen, time, stat, textBeforeLastSeen;
		var friends = f.items;

		for (var i = 0; i < f.items.length; i++){
			userName  = friends[i].first_name + " "+ friends[i].last_name;
			userImage = friends[i].photo_100;
			online = friends[i].online;
			lastSeen = (friends[i].last_seen == undefined)? "" : friends[i].last_seen.time;
			//ставим значения стаутсу в вк
			if (friends[i].status != undefined && friends[i].status.length > 27){
				status = friends[i].status.slice(0, 27) + "..." ;
			}else if (friends[i].status == undefined){
				status = "";
			}else{
				status = friends[i].status;
			}

			if (online == 1) {
				time = "";
				stat = "<img src='img/status_desctop.png' alt='status' id='status_user'>";
				textBeforeLastSeen = "online";

				//в этом месте находится дата последниего время онлайн оно скрыто если юзер онлайн
				$(".side_bar_messages_container > div:last-child > p:last-child").css("display","none");
			}
			else {
				stat = "";
				//время последнего посишения
				time  =  timeConverter(lastSeen);
				textBeforeLastSeen = "was at ";
			}
			drawInHtml(userName, userImage, status, textBeforeLastSeen, time, stat);			
		}
		// функция ресует html для сайдбара 	
		function drawInHtml(name, img, status, textBeforeLastSeen, lastSeenTime, state){
			html += "<div class='friends_content'>"
			  		+ "<div>"
						+ "<img src='" + img + "'alt='img_conversation' />"
						+ state 
					+ "</div>"
					+ "<div>"
						+ "<p style='color: black'>" + name + "</p>"
						+ "<p>" + status + "</p>"
					+ "</div>"
					+ "<div>"
						+ "<p>" + textBeforeLastSeen + lastSeenTime + "</P>"
					+ "</div>"
				+ "</div>";

			$(".bottom_bar_content").html(html);
		}
		function timeConverter(UNIX_timestamp){
  			var a = new Date(UNIX_timestamp * 1000);
  			var b = new Date();
  			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  			var year = a.getFullYear() == b.getFullYear() ? "" : a.getFullYear();
  			var month = months[a.getMonth()];
  			
  			//если собшения пришло сегодня то выводит только время собшения
  			if (a.getDate() == b.getDate() && a.getMonth() == b.getMonth()){
  				//var date = "";
  				var hour = a.getHours();
  				var min  = a.getMinutes();
  				var time =  hour + ':' + min;	
  			}// если оно пришло вчера то выводит только надпись вчера  
  			else if (a.getDate() == (b.getDate() - 1) &&  a.getMonth() == b.getMonth()){
  				var date = "yesterday";
  				var time = 	date ;
  			}// а если старое то только число и годб год в том случие если он не равен нашему году 
  			else{ 
  				var date = a.getDate();
  				var time = date + ' ' + month + ' ' + year ;
  			}
  			return time;
		}
	}	
}

// Показывает инфу о текущем юзере (сверху в сайдбаре)
sendRequest("users.get", {fields: 'photo_100,status'}, (data) => Draw_user_information(data.response[0]));
function Draw_user_information (user){
	$("#photo_user").attr("src", user.photo_100);

	$("#name_user").text(user.first_name + ' ' + user.last_name);

	$("#status_input").attr("value", user.status);
}
//метод для обновленмя статуса
function setStatus () {
	sendRequest("status.set", {text: document.querySelector("#status_input").value }, function (data) {
		if(data.response != 1) throw new Error (data.error.error_msg)});
	return false;
}

// При клике на крест сворачивает сайдбар на мини сайдбар
$("img[alt='remove']").on("click", function(){
	$("aside").css("animation-name", "sidebarHide");
	$(".top_bottom_bar > div > input").css("display", "none");
	$(".miniside").css("display", "flex");
	$(".no_history").css("width", "calc(100vw - 70px)");
	setTimeout(() => $("aside").css("display", "none"), 1000);
	sendRequest('friends.search', {count: 50, fields: 'photo_100'}, (data) => drawFriends(data.response));
	function drawFriends (friends){
		var html = " ";
		$("main").css({ "width": "calc(-97px + 100vw)", "position": "relative", "left": "80px" });
		$(".chat_information").css({"width": "calc(100vw - 80px", "left": "80px"});
		$(".chat_menu").css({"width": "calc(100vw - 80px", "left": "80px" });
		$(".chat_messege").css("width", "calc(100vw - 100px");
		$(".list_search").css("display", "none");
		for (var i = 0; i < friends.items.length; i++)
			html += "<li title='" + friends.items[i].first_name + ' ' + friends.items[i].last_name + "'>" 
				+ "<img src=" + friends.items[i].photo_100 + "/>" 
			+ "</li>";
		$(html).appendTo("#sidebar");
	}
});
// При клике на лого меню разворачивает сайдбар
$("img[alt='menu']").on("click", function(){
	$(".miniside").css("display", "none");
	$("aside").css("display", "flex");
	$("aside").css("animation-name", "sidebarBack");
	$(".chat_information").css({"width": "calc(100vw - 370px","left": "auto" });
	$(".chat_menu").css({"width": "calc(100vw - 384px", "left": "auto" });
	$(".chat_messege").css("width", "calc(100vw - 383px");
	$(".no_history").css("width", "calc(100vw - 385px)");
	setTimeout(() => $(".top_bottom_bar > div > input").css("display", "block"), 1000);
	$("main").css({ "width": "calc(100vw - 390px)", "position": "relative", "left": "373px" });
});