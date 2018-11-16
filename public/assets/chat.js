$(document).ready(function () {

	
	var ws = new ReconnectingWebSocket("ws://localhost:5000", null, { debug: false, reconnectInterval: 3000 });

	var elmnt = document.getElementById("chat-zera");

	ws.onopen = function () {
	};

	ws.onmessage = function (evt) {
		var object = JSON.parse(evt.data);
		console.log(object);
		if (object.type === 'open') {
			$('.chat').append('<li class="info">' + object.from + object.data + '</li>');
		} else if (object.type === 'message') {
			var time = new Date();
			$(".chat").append('<li class="other"><div class="msg"><span><b>' + object.from + '</b>:</span><p>' + object.data + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
		}
		scrollToBottom();
	};

	function scrollToTop() {
		elmnt.scrollIntoView(true); 
	}

	function scrollToBottom() {
		elmnt.scrollIntoView(false);
	}


	ws.onclose = function () {
	};

	$("#submit").submit(function (e) {
		e.preventDefault();
		var name = $("#nickname").val();
		var time = new Date();

		if (name.length > 0) {
			$("#nick").fadeOut();
			$("#chat").fadeIn();

			$("#name").html("Seja bem vindoZera, " + name);
			$("#time").html('Logou as ' + time.getHours() + ':' + time.getMinutes());

			scrollToBottom();

			ws.send(JSON.stringify({ from: name, data: ' is connectedZera :D', type: 'open' }));
		} else {
			alert('Login inválido...')
		}
	});

	$("#textarea").keypress(function (e) {
		if (e.which == 13) {
			var name = $("#nickname").val();
			var text = $("#textarea").val();
			$("#textarea").val('');
			var time = new Date();
			$(".chat").append('<li class="self"><div class="msg"><span>' + $("#nickname").val() + ':</span><p>' + text + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');

			scrollToBottom();

			ws.send(JSON.stringify({ from: name, data: text, type: 'message' }));
		}
	});


});