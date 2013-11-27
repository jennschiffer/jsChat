window.onload = function() {

	/* TODO LIST 
	*	- check against a list of nick/passwords
	*	- ability to change password
	* 	- different colors for each nickname
	*	- timestamp for each message 
	*	- log messages -> [time #color] name: message
	*	- @nick alerts
	*	- markdown support
	*/
	
	var nickname, password;

	var loginForm = document.forms[0];

	loginForm.onsubmit = function() {
		/* TODO validate login */
		nickname = loginForm.nickname.value;
		password = loginForm.password.value;
		pubChatAuthenticated();
		return false;
	}

	var pubChatAuthenticated = function() {

		loginForm.parentNode.removeChild(loginForm);
		document.getElementById('pubchat').style.display = 'block';

		/*** pubchatroom and its events ***/
		var messageContainer = document.getElementById('pubChat-messages');
		var textInput = document.forms[0].message;
		var banter = [];

		// add keyup event					
		textInput.onkeyup = function(e){
			var key = e.keyCode;
			var message = {
				nick: nickname,
			};
			
			if ( key != '13' ) {
				return;
			}
			else {
				message.text = this.value;
				socket.emit('send', { chat: message });
				this.value = "";
			}
		};
		
		// submit form event
		document.forms[0].onsubmit = function() {
			return false;
		};
		
		
		/*** sockets and its events ***/
		var socket = io.connect('http://localhost:3000');
		
		socket.on('connect',function() {
			console.log('wilkommen auf pubChat, ' + nickname);
		});
		
		socket.on('message',function(data) {
			if ( data.chat ) {
				banter.push(data.chat);
				var banterHTML = '';
				
				for ( var i = 0; i < banter.length; i++ ) {
					banterHTML += '<li><span class="nick">' + banter[i].nick 
									+ ':</span> <span class="text">' + banter[i].text + '</span></li>';
				}
				messageContainer.innerHTML = banterHTML;
				messageContainer.scrollTop = messageContainer.scrollHeight;
			}
			else if ( data.system ) {
				console.log(data);
			}
		});
		
		socket.on('disconnect',function() {
			console.log('The client has disconnected!');
		});

	};
	
};