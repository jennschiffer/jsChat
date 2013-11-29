window.onload = function() {

	/* TODO LIST 
	*	- bind alerts to users
    *    - list users in the room
    *     - tell when a user leaves
    *    - logoff button
    *	 - room topic
    *    - ability to change password
    *     - different colors for each nickname
    *    - timestamp for each message 
    *    - log messages -> [time #color] name: message
    *    - @nick alerts
    *    - markdown support
    *    - show when user leaves room
    *    - show when chat has disconnected
    *    - FIND A PLACE TO HOST THIS THING
    */
    
    var nickname, 
        password, 
        color,
        messageContainer, 
        textInput, 
        socket, 
        banter;
        
    var loginForm = document.forms[0];
    
    /*** INIT SOCKETS AND CHAT ***/

    var initjsChat = function() {
        
        /*** jsChatroom and its events ***/
        document.getElementById('jsChat').style.display = 'block';
        messageContainer = document.getElementById('jsChat-messages');
        textInput = document.forms[0].message;
        banter = [];

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

    };
    
    /*** initialize socket and its events ***/
    var initSocket = function() {
        
        socket = io.connect('http://localhost:3000');
        
        socket.on('connect',function() {
            console.log('welcome to jsChat');
            initjsChat();
        });
        
        socket.on('message',function(data) {
            if ( data.chat ) {
                updateMessageWindow(data.chat);
            }
        });
        
        socket.on('disconnect',function() {
            console.log('The client has disconnected!');
        });
    };
    
    
    
    
    /*** HELPERS ***/
    
    var updateMessageWindow = function(chatData) {
        banter.push(chatData);
        var banterHTML = '';
        
        for ( var i = 0; i < banter.length; i++ ) {
            banterHTML += '<li><span class="nick" style="color:' + color + '">' + banter[i].nick 
                            + ':</span> <span class="text">' + banter[i].text + '</span></li>';
        }
        messageContainer.innerHTML = banterHTML;
        messageContainer.scrollTop = messageContainer.scrollHeight;
    };
    
    
    
    
    /*** INIT ***/
    
    var init = (function() {
    
    	// check for jschat cookies
    	// it will return name, color, and if authentic
    	
    	if ( document.cookie ) {
	        initSocket();
	        console.log(document.cookie);
    	}
    	else {
	    	// if no cookies, redirect to login
	    	document.location = '/login';
    	}

    }());
    
};