window.onload = () => $(".side_bar_messages_container").on("click", function (pElement) { drawMessageHistory($(pElement.currentTarget.attributes[1]), $(pElement.currentTarget.attributes[2])) });

function drawMessageHistory (chatId, name){
	if (chatId == undefined) return false;

$(".side_bar_messages_container").on("click", function (pElement) { drawMessageHistory($(pElement.currentTarget.attributes[1])) });

function drawMessageHistory(chatId){
	$(".no_history").css("display", "none");

	$("#mainInputForMessage").val("");

	var thisUserId, thisUserImg, thisUserName, chatName;
	
	//document.getElementById("chatName").textContent = name[0].value;

	sendRequest("users.get", {fields: 'photo_50'}, (data) => getThisUser(data.response[0]));

	function getThisUser(thisUser) {
		thisUserId = thisUser.id;
		thisUserImg = thisUser.photo_50;
		thisUserName = thisUser.first_name + " " + thisUser.last_name;
	}

	sendRequest("messages.getHistory", {peer_id: chatId[0].value, count: 20, extended: 1}, (data) => renderMessageHistory(data.response));

	function renderMessageHistory (m){
		var item = m.items.reverse();
		var userImg, userName, timeMessage, textMessage;
		var html = "";
		var mediaContent = "";

		for (var i=0; i < item.length; i++) {
			if (thisUserId != item[i].from_id) {
				for(var k=0; k < m.profiles.length; k++) {
					if (item[i].user_id == m.profiles[k].id) {
						userName = m.profiles[k].first_name + " " + m.profiles[k].last_name;
						userImg = m.profiles[k].photo_50;
					}
				}
			}
			else {
				userName = thisUserName;
				userImg = thisUserImg;
			}
			timeMessage = timeConverter(item[i].date);
			textMessage = item[i].body;
			
			if ("attachments" in item[i]) { // Значит в сообщение есть медиаконтент
				switch (item[i].attachments[0].type) { 
					case "photo": mediaContent = "<img class='message_photo' src='" + item[i].attachments[0].photo.photo_604 + "'><br>"; break;
					case "video": console.log("This message type (video) is not yet supported"); console.log(item[i].attachments[0]); break;
					case "audio": mediaContent = "<audio controls class='message_audio' title='" + item[i].attachments[0].audio.artist + " " + item[i].attachments[0].audio.title + "'src='" + item[i].attachments[0].audio.url + "'></audio><br>"; break;
					case "doc": console.log("This message type (doc) is not yet supported"); console.log(item[i].attachments[0]); break;
					case "link": console.log("This message type (link) is not yet supported"); console.log(item[i].attachments[0]); break;
					case "market": console.log("This message type (market) is not yet supported"); console.log(item[i].attachments[0]); break;
					case "market_album": console.log("This message type (market_album) is not yet supported"); console.log(item[i].attachments[0]); break;
					case "wall": console.log("This message type (wall) is not yet supported"); console.log(item[i].attachments[0]); break;
					case "wall_reply": console.log("This message type (wall_reply) is not yet supported"); console.log(item[i].attachments[0]); break;
					case "sticker": mediaContent = "<img class='message_sticker' src='" + item[i].attachments[0].sticker.photo_128 + "'><br>"; break;
					case "gift": console.log("This message type (gift) is not yet supported"); console.log(item[i].attachments[0]); break;
				}
			}
			else mediaContent = "";
			if (thisUserId ==  item[i].from_id)
				html += "<div class='" + "this_user_message" + "' title='" + userName + "'>"
					+ "<div>"
						+ "<p class='message_time'>" + timeMessage + "</p>"
						+ "<p class='message_text'>" + mediaContent + textMessage + "</p>"
						+ "</div>"
					+ "<img src='" + userImg + "'alt='icon_user'>"
				+ "</div>"
			else
				html += "<div class='" + "notThis_user_message" + "' title='" + userName + "'>"
					+ "<img src='" + userImg + "'alt='icon_user'>"
					+ "<div>"
						+ "<p class='message_time'>" + timeMessage + "</p>"
						+ "<p class='message_text'>" + mediaContent + textMessage + "</p>"
					+ "</div>"
				+ "</div>"
		}
		// метод при нажатие на кнопку send для отправки собшений
		document.querySelector(".chat_messege_bottom_content_2").onsubmit = function () { 
			sendRequest("messages.send", {peer_id: parseInt(chatId[0].value), message: document.getElementById("mainInputForMessage").value}, (data) => drawMessageHistory (chatId));
			return false;
		}
		// метод для получения времини из времини типа уникс 
		function timeConverter(UNIX_timestamp) {
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
  			}// а если старое то только число и год в том случие если он не равен нашему году 
  			else{ 
  				var date = a.getDate();
  				var time = date + ' ' + month + ' ' + year ;
  			}
  			return time;
		}
		$(".message_history").html(html);
	}
}}
