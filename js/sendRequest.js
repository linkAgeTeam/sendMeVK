 //Эта функция должна генерировать токен  но она почему то это не делает(
/*window.onload = function getToken (){
	if (localStorage.getItem("token") != null) return 0; // Если ключ уже есть то не получать его занного

	var thisLoc = location.href;

	location.href = "https://oauth.vk.com/authorize?client_id=6818569&display=page&scope=friends,status,messages,offline&response_type=token&v=5.52";

	var loc = document.location.href;

	history.go(-1);

	console.log(loc.slice(loc.search('token') + 6, loc.indexOf('&', 50)));

	//localStorage.setItem("token", location.slice(location.search('token') + 6, location.indexOf('&', 50)));


	//https://oauth.vk.com/blank.html#access_token=66ce4b0239e2bf41c8b0975fbfad81c119f1624fec0a95b887b78c691cd452008d4c02c9e7d4847617794&expires_in=0&user_id=183457480
}*/



// Функция принимает метод и его параметры и возврощяет url строку для http запроса
function getUrl (method, params){
	var rToken = "ccdcff221d43ffc19be3b8006cd36663117013aa97a5c7f4e4811cd717c5b2a93630505eedf729fbfeb5b";
	var aToken = "4a4b6ba0e03968cb7d262df9c6ff17f4290ebac788a25755ac2eff40232a44a79ba6cc83f3d04a6e2c68f";
	if (!method) throw new Error('You did not specify a method!'); // Если метод не был указан при вызове функций то будет создана ошибка

	params = params || {}; // Проверка если параметры не переданы то преобразуем их в пустой обьект

	params['access_token'] = aToken;
	return 'https://api.vk.com/method/'+ method + '?' + $.param(params) + '&v=5.52';
}
// Функция создает запрос принимая название метода его параметры и функцию калбека при успешном выполнение
function sendRequest (method, params, func){
	$.ajax({
		url: getUrl(method, params),
		method: 'GET',
		dataType: 'JSONP',
		//statusCode: { 200: () => console.log('Ураа рабатает') }, Просто оставлю это тут :D
		//error: (jqXHR, textStatus) => console.log(jqXHR),
		success: func
	});
}