//https://oauth.vk.com/authorize?client_id=6818569&display=page&scope=friends,messages,offline&response_type=token&v=5.52

var state = setInterval(documentLoad, 100);
var point;

// Это нужно что бы при загрузке по умолчанию была открыта первая вкладка "Message"
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
	if (point == undefined){
		return 0;
	}else {
		document.querySelectorAll(".bottom_bar_menu > div")[point].style.borderBottom = "1px solid #f4f4f4";
		document.querySelectorAll(".bottom_bar_menu > div")[point].style.color = "#4b4b4b";
		point = pointer;
	}
}

// Это нужно что бы мой говнокод работал -Руслан
point = 0;

//запрос для получение и вывод собщений в слайдбаре
sendRequest("messages.getConversations", { count: 16}, (data) => drawMessages(data.response.items));
function drawMessages (message){
	var html = " ";
	for (var i = 0, len = message.length; i < len; i++){
		
		// проверка собшений от беседы или от личной переписки
		if (message[i].conversation.peer.type == "user"){	
			var userId 			= message[i].conversation.peer.id;
			var lastMessage 	= "message";
			var unreadMessages 	= 2 ;
			
			sendRequest("users.get", {user_ids:userId, fields: 'photo_100'},(data) => drawUserMessageBar(data.response[0].first_name, data.response[0].last_name, data.response[0].photo_100)); 
			function drawUserMessageBar(firstName,lastName,img){
				name 		= firstName+" "+lastName ;
				userImage  = img;
				drawInHtml(name, userImage, lastMessage, unreadMessages);
			}
		}else if(message[i].conversation.peer.type == "chat"){
			var chatName		= (message[i].conversation.chat_settings == undefined) ? "no_title" : message[i].conversation.chat_settings.title;
			var chatImage 		= (message[i].conversation.chat_settings.photo == undefined) ? "img/noImageForChat.png" : message[i].conversation.chat_settings.photo.photo_100;  
			var lastMessage 	= message[i].last_message.text;
			var unreadMessages 	= (message[i].conversation.unread_count==undefined) ? "" : message[i].conversation.unread_count;
		
			drawInHtml(chatName, chatImage, lastMessage,unreadMessages);
		}	
		function drawInHtml(name, img, lastMessage, unreadMessages){
			html += "<div class='side_bar_messages_container'>"
			  		+ "<div>"
						+ "<img src='" + img + "'alt='img_conversation' />"
					+ "</div>"
					+ "<div class='side_bar_messages_container_block2'>"
						+ "<p>" + name + "</p>"
						+ "<p>" + lastMessage+ "</p>"
					+ "</div>"
					+ "<div>"
						+ "<p>" + unreadMessages+ "</p>"
						+ "<p>" + "12:16" + "</P>"
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
	//
	sendRequest('friends.search', {count: 50, fields: 'photo_100'}, (data) => drawFriends(data.response));
	function drawFriends (friends){
		var html = " ";

		for (var i = 0; i < friends.items.length; i++)
			html += "<li title='" + friends.items[i].first_name + ' ' + friends.items[i].last_name + "'>" 
				+ "<img src=" + friends.items[i].photo_100 + "/>" 
			+ "</li>";

		$(html).appendTo("#sidebar")
	}
});

// При клике на лого меню разворачивает сайдбар
$("img[alt='menu']").on("click", function(){
	$(".miniside").css("display", "none");

	$("aside").css("display", "flex");

	$("aside").css("animation-name", "sidebarBack");

	setTimeout(() => $(".top_bottom_bar > div > input").css("display", "block"), 1000);
});

