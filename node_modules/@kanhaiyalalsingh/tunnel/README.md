Nodejs bindings for Tunnel.

## Installation

```
npm install @kanhaiyalalsingh/tunnel
```

## Example

```js
var tunnel = require('@kanhaiyalalsingh/tunnel');

//creates an instance of Tunnel
var myTunnel = new tunnel.Tunnel();

// replace <kanhaiya-user> with your user and <kanhaiya-key> with your key.
var tunnelArguments = { 'user': '<kanhaiya-user>', 'key': '<kanhaiya-key>' };

// starts the Tunnl instance with the required arguments
myTunnel.start(tunnelArguments, function(e, status) {
  if(!e) {
    console.log("Started Tunnel " + status);
  }
});

// check if Tunnel instance is running
console.log(myTunnel.isRunning());

// stop the Tunnel instance
myTunnel.stop(function() {
  console.log("Stopped Tunnel");
});

```