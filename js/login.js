window.onload = function(){
	//сылка по которой получает юзер токин
	var url = "https://oauth.vk.com/authorize?client_id=6818569&display=page&scope=friends,status,messages,offline&response_type=token&v=5.52";
	document.getElementById("vkLoginButton").onclick = function(){
		window.Location.href = url ;
		console.log(url);
	}
}		
