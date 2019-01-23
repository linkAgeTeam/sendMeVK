//https://oauth.vk.com/authorize?client_id=6818569&display=page&scope=friends,messages,offline&response_type=token&v=5.52

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

// Обрабатывает работу меню в сайдбаре
function menu (pointer){
	document.querySelectorAll(".bottom_bar_menu > div")[pointer].style.borderBottom = "2px solid #72a7ff";
	document.querySelectorAll(".bottom_bar_menu > div")[pointer].style.color = "#3367d6";

	if (point == undefined) return 0;

	document.querySelectorAll(".bottom_bar_menu > div")[point].style.borderBottom = "1px solid #f4f4f4";
	document.querySelectorAll(".bottom_bar_menu > div")[point].style.color = "#4b4b4b";
	
	//pointer = 0 при вслуче открыт первое меню сайдбара собщения 
	if(pointer == 0){
		$(".side_bar_messages_container").css("display","flex");
		$(".side_bar_friends_container").css("display","none");
	//Pinert = 1 открыт в сйдбаре 2 веню друзья 	
	}else if(pointer == 1){
		//скрывает сайдбар с собщенями
		$(".side_bar_messages_container").css("display","none");
		friendsMenu();
	}	
	point = pointer;
}
	point = 0;// этот код нужен чтобы мой говно код работал - Руслан

// Запрос для получение и вывод собщений в сайдбаре
sendRequest("messages.getConversations", { count: 20, extended: 1}, (data) => drawMessages(data.response));

// Функция рабоатет для получение response от верхнего запроса 
// так же ресуется вкладка собшения на слайдбаре
function drawMessages(m){
	var html = " ";
	var message = m.items ;//array в котором хранятся last_message и Conversation

	for (var i = 0, len = message.length; i < len; i++){
		if (message[i].conversation.peer.type == "user"){	
			var userId = message[i].conversation.peer.id;
			var unreadMessages = (message[i].conversation.unread_count == undefined) ? "" : message[i].conversation.unread_count;
			var style = (message[i].conversation.unread_count == undefined) ? "style='display: none'" : "style='display: block'";
			var lastMessage = (message[i].last_message.text.length > 27) ? message[i].last_message.text.slice(0, 27) + '...' : message[i].last_message.text; 			
  			var time = timeConverter(message[i].last_message.date);

			//m.profile array где хранятся профайлы юзеров, в цикл проверяется id 
			for (var j = 0; j <  m.profiles.length; j++){
				if (m.profiles[j].id  == userId){
					userName = m.profiles[j].first_name + " " + m.profiles[j].last_name ;
					userImage = m.profiles[j].photo_100; 
					
					drawInHtml(userName, userImage, lastMessage, unreadMessages, style, time);
				}
			}
		}
		else if(message[i].conversation.peer.type == "chat"){
			var chatName = message[i].conversation.chat_settings == undefined ? "no_title" : message[i].conversation.chat_settings.title;
			var chatImage = message[i].conversation.chat_settings.photo == undefined ? "img/noImageForChat.png" : message[i].conversation.chat_settings.photo.photo_100;  
			var unreadMessages = message[i].conversation.unread_count == undefined ? "" : message[i].conversation.unread_count;
			var style = message[i].conversation.unread_count == undefined ? "style='display: none'" : "style='display: block'";

			message[i].last_message.text.length > 27 ? lastMessage = message[i].last_message.text.slice(0, 27) + '...' : lastMessage = message[i].last_message.text;

  			var time = timeConverter(message[i].last_message.date);

			drawInHtml(chatName, chatImage, lastMessage, unreadMessages, style, time);
		}
		else if (message[i].conversation.peer.type == "group"){
			var chatName, chatImage;

			for (var k = 0; k < m.groups.length; k++){
				if (m.groups[k].id == message[i].conversation.peer.local_id) {
					chatName = m.groups[k].name;
					chatImage = m.groups[k].photo_100;
				}
			}
			var lastMessage = (message[i].last_message.text.length > 27) ? message[i].last_message.text.slice(0, 27) + '...' : message[i].last_message.text;
			var unreadMessages = (message[i].conversation.unread_count == undefined) ? "" : message[i].conversation.unread_count;
			var style = (message[i].conversation.unread_count == undefined) ? "style='display: none'" : "style='display: block'";
			var time = timeConverter(message[i].last_message.date);

			drawInHtml(chatName, chatImage, lastMessage, unreadMessages, style, time);
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

		// функция ресует html для сайдбара 	
		function drawInHtml(name, img, lastMessage, unreadMessages, style, time){
			html += "<div class='side_bar_messages_container'>"
			  		+ "<div>"
						+ "<img src='" + img + "'alt='img_conversation' />"
					+ "</div>"
					+ "<div class='side_bar_messages_container_block2'>"
						+ "<p>" + name + "</p>"
						+ "<p>" + lastMessage+ "</p>"
					+ "</div>"
					+ "<div>"
						+ "<p " + style + ">" + unreadMessages + "</p>"
						+ "<p>" + time + "</P>"
					+ "</div>"
				+ "</div>";
			$(".bottom_bar_content").html(html);
		}
	}
}

//функция для вызова список длрузей в сйдбаре пре клике 
function friendsMenu(){	
	//запрос по получению данных друзей с вк апи
	sendRequest('friends.search', { count:15,fields: 'photo_100,status,online,last_seen' }, (data) => drawFriends(data.response));
	
	// метод отвеает на запрос и выводи список друзей...
	function drawFriends(f){
		var html = " ";
		var name, userImage, status, online, lastSeen, style, time;
		var friends = f.items;
		for (var i = 0; i < f.items.length; i++){
			userName  = friends[i].first_name + " "+ friends[i].last_name;
			userImage = friends[i].photo_100;
			userStatus = friends[i].status; 
			online = friends[i].online;
			lastSeen = friends[i].last_seen.time;
			//если юзер онлайн то должно гореть только олайн 
			if (online == 1) {
				style = "style='display: block'";
				online = '';
				time = "";

				//в этом месте находится дата последниего время онлайн оно скрыто если юзер онлайн
				$(".side_bar_messages_container > div:last-child > p:last-child").css("display","none");
			}else {
				style = "style='display: none'";

				//время последнего посишения
				time  =  timeConverter(lastSeen);
			}
			drawInHtml(userName,userImage,userStatus,online, style, time);			


		}
		// метод для время ыремя из времини unixtime
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

		// функция ресует html для сайдбара 	
		function drawInHtml(name, img, status, online, style, lastSeenTime){
			html += "<div class='side_bar_friends_container'>"
			  		+ "<div>"
						+ "<img src='" + img + "'alt='img_conversation' />"
					+ "</div>"
					+ "<div class='side_bar_friends_container_block2'>"
						+ "<p>" + name + "</p>"
						+ "<p>" + status+ "</p>"
					+ "</div>"
					+ "<div>"
						+ "<p " + style + ">" + online + "</p>"
						+ "<p>" + lastSeenTime + "</P>"
					+ "</div>"
				+ "</div>";
			$(".bottom_bar_content").html(html);
		}
	}	
}

// Показывает инфу о текущем юзере (сверху в сайдбаре)
sendRequest ("users.get", {fields: 'photo_100,status'}, (data) => Draw_user_information(data.response[0]));
function Draw_user_information (user){
	$("#photo_user").attr("src", user.photo_100);

	$("#name_user").text(user.first_name + ' ' + user.last_name);

	$("#status").text(user.status);
}
// При клике на крест сворачивает сайдбар на мини сайдбар
$("img[alt='remove']").on("click", function(){
	$("aside").css("animation-name", "sidebarHide");

	$(".top_bottom_bar > div > input").css("display", "none");

	$(".miniside").css("display", "flex");

	setTimeout(() => $("aside").css("display", "none"), 1000);
	
	sendRequest('friends.search', {count: 50, fields: 'photo_100'}, (data) => drawFriends(data.response));
	function drawFriends (friends){
		var html = " ";

		$("main").css({ "width": "calc(100vw - 80px)", "position": "relative", "left": "80px" });
		$(".chat_information").css("width", "calc(100vw - 80px");
		$(".chat_menu").css("width", "calc(100vw - 80px");
		$(".chat_messege").css("width", "calc(100vw - 80px");

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
	$(".chat_information").css("width", "calc(100vw - 370px");
	$(".chat_menu").css("width", "calc(100vw - 370px");
	$(".chat_messege").css("width", "calc(100vw - 370px");
	setTimeout(() => $(".top_bottom_bar > div > input").css("display", "block"), 1000);
	$("main").css({ "width": "calc(100vw - 370px)", "position": "relative", "left": "0px" });
});