# node-load-balanced-sessions
Experimentation scaling node application across multiple servers without a proxy

###Problem
Scaling applications horizontally uses a single proxy or some other director to spread the work out to multiple servers. This means that no matter how many servers you have to service requests, one single server is still responsible for handing the work out. Here I attempting to remove that server entirely and let the servers figure it out for them selves.

###High Level Overview
Servers need to listen for requests from other servers.
Servers need to request help from other servers when their connection threshold is reached.
Servers need to notify requesting server of their availability to take on the work.
Servers receiving an available response from a server must be able to push their work over to that server.
Servers must be able to seamlessly service clients when recieving the work from another server.
Application servers must be able to transfer client state and clients must be able to start sending new requests to the new server

###Project Structure
Testing servers reside in the bin directory. (www1, www2, www3)
Also in the bin directory is script called servers.js which launches the servers in separate proccesses.
All the servers run the same app.js from project root.
Project root also contains a file called proxiless.js. This is the module for implementing the proxyless solution.

###Usage
Each of the servers in bin requires in this module passing to its server instance.
Having required in the proxiless module, each server creates an array of objects representing its sibling servers. The the array is passed to the proxiless function called selfProxy along with the maximum connections the server can have before looking for help, the host name of the server and the port for proxiless to use for communications.

###Functionality
The test servers can listen for request for help from other servers and respond with their availability. They can also receive a message representing the requesting servers work back from the requesting server. Each server also has the ability to detect its threshold, request assistance and send the message representing the work when the threshold is reached.

###Next steps
For use with a web application cluster, it needs to be able to pass the client state around and direct the client to the receiving server for further communications without any complaints from the browser.