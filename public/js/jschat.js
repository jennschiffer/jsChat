window.onload = function() {
    
    var userInfo,
    	muteSwitch,
        messageContainer,
        textInput, 
        socket, 
        banter;
        
    var copy = {
	    enteredTheRoom: 'has entered the room',
	    disconnected: 'You have been disconnected.',
	    mute: 'mute',
	    unmute: 'unmute'
    };
    
    var status = {
	    mute: false
    };
    	
    var loginForm = document.forms[0];
    var favicon = document.getElementsByTagName('link')[1];
    var alertSound = new Audio('/assets/alert.wav');

    /*** INIT SOCKETS AND CHAT ***/

    var initjsChat = function() {
        
        /*** jsChatroom and its events ***/
        document.getElementById('jsChat').style.display = 'block';
        messageContainer = document.getElementById('jsChat-messages');
        activeUsersList = document.getElementById('active-users');
        muteSwitch = document.getElementById('mute-switch');
        console.log(muteSwitch);
        textInput = document.forms[0].message;
        banter = [];
        activeUsers = [];

        // add keyup event                    
        textInput.onkeyup = function(e){
            var key = e.keyCode;
            if ( key != '13' ) {
                return;
            }
            else {
                sendMessage( userInfo.nickname, userInfo.color, this.value )
                this.value = "";
            }
        };
        
        // submit form event
        document.forms[0].onsubmit = function() {
            return false;
        };
        
        // mute event
        muteSwitch.onclick = function(e) {
        console.log('ok');
	    	e.preventDefault();
		    if ( this.innerText == copy.mute ) {
			    this.innerText = copy.unmute;
			    status.mute = true;
		    }
		    else {
			    this.innerText = copy.mute;
			    status.mute = false;
		    }
	    }


    };
    
    /*** initialize socket and its events ***/
    var initSocket = function() {
        
        socket = io.connect(system.io);
        
        socket.on('connect',function() {
            initjsChat();
            
            // send message that userInfo.nickname has entered room
            system.message = userInfo.nickname + ' ' + copy.enteredTheRoom;
            sendMessage(system.name, system.color, system.message);
                      
        });
        
        socket.on('message',function(data) {
            if ( data.chat ) {
                updateMessageWindow(data.chat);
            }
            if ( status.blur ) {
	            favicon.href = "/assets/alert.ico";
	            if ( !status.mute ) {
		            alertSound.play();
	            }
            }
        });
        
        socket.on('disconnect',function() {            
            document.forms[0].getElementsByTagName('label')[0].innerText = copy.disconnected;
            textInput.style.display = 'none';            
        });
    };
    
    /*** alerts ***/
	
	window.onblur = function() {
		status.blur = true;
	}
	window.onfocus = function() {
		status.blur = false;
		favicon.href = "/assets/jschat.ico";
	}
    
    
    /*** HELPERS ***/
    
    var updateMessageWindow = function(chatData) {
        banter.push(chatData);
        var banterHTML = '';
        
        for ( var i = 0; i < banter.length; i++ ) {
        	if ( banter[i].nick == system.name ) {
	        	banterHTML += '<li class="system"><span class="text">' + stripHTML(banter[i].text) + '</span></li>';
        	}
        	else {
                banterHTML += '<li><span class="nick" style="color:' + stripHTML(banter[i].color) + '">' + stripHTML(banter[i].nick) 
                            + ':</span> <span class="text">' + processMessageText( stripHTML(banter[i].text) ) + '</span></li>';
            }
        }
        messageContainer.innerHTML = banterHTML;
        messageContainer.scrollTop = messageContainer.scrollHeight;
    };
    
    var getCookies = function() {
        var cookies = {}; 
        var documentCookies = document.cookie;
        if (documentCookies === "")
            return cookies;
        var cookiesArray = documentCookies.split("; ");
        for(var i = 0; i < cookiesArray.length; i++) {
            var cookie = cookiesArray[i];
            var endOfName = cookie.indexOf("=");
            var name = cookie.substring(0, endOfName);
            var value = cookie.substring(endOfName + 1); 
            value = decodeURIComponent(value);
            cookies[name] = value;
        }
        return cookies;
    };
    
    var sendMessage = function( nick, color, message ) {
        var message = {
        	nick: nick,
	        color: color,
	        text: message,
	        timestamp: Date.now()
        };
        socket.emit('send', { chat: message });
    };
    
	var stripHTML = function(html) {
	    return html.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi, '');
	};
	
	var processMessageText = function(messageText) {
		
	/*	// TODO: linkify
		var i = 0;
		while ( i != -1 ) {
			i = messageText.indexOf('http://', i);
			i = 
		}
		
		// TODO: shortcodes
	*/
	
		return messageText;
		
	};
    
    
    /*** INIT ***/
    
    var init = (function() {
    
    	// check for jschat cookies    	
    	var cookies = getCookies();
    	
    	if ( cookies.jschat) {
	        initSocket();
			userInfo = JSON.parse( cookies.jschat );	
    	}
    	else {
	    	// if no cookies, redirect to login
	    	document.location = '/login';
    	}

    }());
    
};