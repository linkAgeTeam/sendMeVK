var language = navigator.language;

window.onload = () => renderContent();

function renderContent() {
	if (localStorage.getItem("token") == null) {
		if (language == 'ru') {
			$(".login").html("<p>Приветствуем вас в Sens me vk!</p>"
			+ "<p>Похоже вы используете наше приложение впервые поэтому вам нужно получить токен!</p>"
			+ "<p>Следуёте этой инструкций что бы получить tokenid:</p>"
			+ "<p>1. Перейдите по указанной <a target='_blank' href='https://oauth.vk.com/authorize?client_id=6818569&display=page&scope=friends,status,messages,offline&response_type=token&v=5.52'>Ссылки</a></p>"
			+ "<p>2. Скопируйте url в вашей адресной строке вернитесь сюда и вставьте его в поле:</p>"
			+ "<form method='get' id='form' action=''>"
			+ "<input type='text' placeholder='Вставте url сюда'>"
			+ "<button>Отправить</button>"
			+ "</input></form>");
		}
		else {
			$(".login").html("<p>Welcome you to Sens me vk!</p>"
			+ "<p>It looks like you are using our application for the first time so you need to get a token!</p>"
			+ "<p>Follow these instructions to get tokenid:</p>"
			+ "<p>1. Follow this <a target='_blank' href='https://oauth.vk.com/authorize?client_id=6818569&display=page&scope=friends,status,messages,offline&response_type=token&v=5.52'>link</a></p>"
			+ "<p>2. Copy the url in your address bar, go back here and paste it into the field:</p>"
			+ "<form method='get' id='form' action=''>"
			+ "<input type='text' placeholder='Insert url'>"
			+ "<button>Send</button>"
			+ "</input></form>");
		}

		document.querySelector("#form").onsubmit = function () {
			let token = document.querySelector("input").value;
			localStorage.setItem("token", token.slice(token.indexOf("token=")+6, token.indexOf("&expires")));
			location.reload(true);
		}
	}
	else location.href='main.html';

	$("#ru").on("click", function () {
		language = "ru";
		renderContent();
		$("#lan")[0].textContent = "Язык";
	});
	$("#en").on("click", function () {
		language = "en";
		renderContent();
		$("#lan")[0].textContent = "Language";
	});
}