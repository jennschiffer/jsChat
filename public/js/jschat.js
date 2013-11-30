window.onload = function() {

	/* TODO LIST 
    *    - show when user leaves room
    *    - list users in the room
    *    - ability to change password
    *    - log messages -> [time #color] name: message
    *    - markdown support
    *	 - commands
    *	   * room topic
    *      * links
    *      * shortcodes
    *    - FIND A PLACE TO HOST THIS THING
    */
    
    var userInfo,
        messageContainer,
        textInput, 
        socket, 
        banter;
        
    var copy = {
	    enteredTheRoom: 'has entered the room',
	    disconnected: 'You have been disconnected.',
    };
        
    var system = {
    	io: 'http://localhost:3000',
        name: 'jschat',
    	color: 'gray'
    };
    	
    var loginForm = document.forms[0];
    
    /*** INIT SOCKETS AND CHAT ***/

    var initjsChat = function() {
        
        /*** jsChatroom and its events ***/
        document.getElementById('jsChat').style.display = 'block';
        messageContainer = document.getElementById('jsChat-messages');
        activeUsersList = document.getElementById('active-users');
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
        });
        
        socket.on('disconnect',function() {            
            document.forms[0].getElementsByTagName('label')[0].innerText = copy.disconnected;
            textInput.style.display = 'none';            
        });
    };
    
    
    
    
    /*** HELPERS ***/
    
    var updateMessageWindow = function(chatData) {
        banter.push(chatData);
        var banterHTML = '';
        
        for ( var i = 0; i < banter.length; i++ ) {
        	if ( banter[i].nick == system.name ) {
	        	banterHTML += '<li class="system"><span class="text">' + banter[i].text + '</span></li>';
        	}
        	else {
                banterHTML += '<li><span class="nick" style="color:' + banter[i].color + '">' + banter[i].nick 
                            + ':</span> <span class="text">' + banter[i].text + '</span></li>';
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