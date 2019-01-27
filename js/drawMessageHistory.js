window.onload = () => $(".side_bar_messages_container").on("click", function (pElement) { drawMessageHistory($(pElement.currentTarget.attributes[1])) });


function drawMessageHistory (chatId){
	var thisUserId, thisUserImg, thisUserName, chatName;

	chatName = document.getElementById("chatName");
	chatName.innerHTML = chatId[0].ownerElement.children[1].children[0].innerHTML;

	sendRequest("users.get", {fields: 'photo_50'}, (data) => getThisUser(data.response[0]));
	function getThisUser(thisUser) { thisUserId = thisUser.id; thisUserImg = thisUser.photo_50; thisUserName = thisUser.first_name + " " + thisUser.last_name; }

	sendRequest("messages.getHistory", {peer_id: chatId[0].value, count: 100, extended: 1}, (data) => renderMessageHistory(data.response));

	function renderMessageHistory (m){
		var item = m.items.reverse();
		var userImg, userName, timeMessage, textMessage;
		var html = "";

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
			
			if (thisUserId ==  item[i].from_id)
				html += "<div class='" + "this_user_message" + "' title='" + userName + "'>"
					+ "<div>"
						+ "<p class='message_time'>" + timeMessage + "</p>"
						+ "<p class='message_text'>" + textMessage + "</p>"
						+ "</div>"
					+ "<img src='" + userImg + "'alt='icon_user'>"
				+ "</div>"
			else
				html += "<div class='" + "notThis_user_message" + "' title='" + userName + "'>"
					+ "<img src='" + userImg + "'alt='icon_user'>"
					+ "<div>"
						+ "<p class='message_time'>" + timeMessage + "</p>"
						+ "<p class='message_text'>" + textMessage + "</p>"
					+ "</div>"
				+ "</div>"
		}
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
}