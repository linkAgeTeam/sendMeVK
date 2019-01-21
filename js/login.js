window.onload = function(){
	//обкт кнопка для регистрации в вк и получения токина 
	var loginButton = document.getElementById("vkLoginButton");

	//сылка по которой получает юзер токин
	var url = "https://oauth.vk.com/authorize?client_id=6818569&display=page&scope=friends,messages,offline&response_type=token&v=5.52";
	loginButton.onclick = function(){
		window.Location.href = url ;
		console.log(url);
	}
}		
