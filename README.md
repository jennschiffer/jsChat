jsChat
=======

a simple node/websockets chat

### install

1. add files to some directory on your server [node must be installed](http://nodejs.org/download/).

2. install dependencies by running: <code>npm install</code>

dependencies:
* express
* socket.io
* sqlite3

3. to start chat server, run <code>npm start</code>

4. direct your browser to <code>localhost:3000</code>

### Notes 

1. if you are running for the first time, <code>jschat.db</code> will be created with a user <code>{ nickname: root, password: root}</code>

2. works on browsers that support [socket.io](http://socket.io/#browser-support)

### Just a big fat FYI

1. this is a learning project for me - basically it is the first time I've ever worked with node, socket.io, express, and sqlite3 all together

2. this has not been tested beyond my own machine

3. if you have suggestions for best practices, please PLEASE post an issue or reach out to me <jenn@pancaketheorem.com>. I'd love to get some insight from those of you who are experienced with these technologies.