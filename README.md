# BimccRTC
Based on webrtc and php+swoole technology, use DrawerJS to realize collaborative whiteboard. Refer to some Skyrtc ideas, thanks to skyrtc and DrawerJS.

Demo :

![](https://github.com/bimcc/BimccRTC/blob/master/whiteboard-demo.png)

In this example, after the canvas is drawn, click Send to synchronize. If you want to achieve realtime synchronization and Video communication , There is already related code in the demo. Please implement it yourself.
#### Six basic concept in the WebRTC Peerconnection communication process:
- Signaling Server -- we use php and swoole to realize Signaling Server
- ICE/TURN/STUN Server  -- we use coturn server
- Room -- Signaling Server uses the concept of Room to manage the peers of the same set of communications. One room contains one or more peers.
- Offer -- The peer that actively establishes a P2P link with other peers organizes its SDP information and forwards it to other peers in the room through the signaling server. This SDP packet is Offer.
- Answer -- After receiving the offer information of other peers forwarded by the signaling server, the passively connected Peer also organizes its own SDP information, and also forwards it to the peer that actively connects to it through the signaling server. His own SDP information packet is Answer;
- IceCandidate -- Peer establishes a connection directly with ICE/TURN/STUN Server to obtain its own NAT type and external network IP and port. The messages returned by these ICE/TURN/STUN Servers are IceCandidate or directly referred to as Candidate;

#### Principle introduction :

![](https://github.com/bimcc/BimccRTC/blob/master/1.png)
![](https://github.com/bimcc/BimccRTC/blob/master/2.png)

- ClientA and ClientB connect to Signaling Server through WebSocket.
- ClientA first accesses the local media interface and data through GetMedia, 
and creates a PeerConnection object, and calls its AddStream method to add the local Media to the PeerConnection object. 
For ClientA, you can create and initialize a PeerConnection as in Phase 1 before establishing a connection with Signaling Server, 
or you can create and initialize a PeerConnection as Phase 2 after establishing a Signaling Server connection;
 ClientB can be either in Phase 1 of the above diagram or Do the same thing in 2 stages, 
 access your own local interface and create your own PeerConnection object.
- The communication is initiated by ClientA, so ClientA calls the CreateOffer interface of PeerConnection to create its own SDP offer, and then forwards the SDP Offer information to ClientB through the Signaling Server channel.
- After ClientB receives the SDP information of ClientA transferred from Signaling Server, that is, the offer, call CreateAnswer to create its own SDP information, which is answer, and then forward the answer to ClientA through the Signaling server.
- ClientA waits for the communication from the ICE server when it is created by its own PeerConnection, and obtains its own candidate. When the candidate is available, it will automatically return the OnIceCandidate of the PeerConnection.
- ClientA sends its own Candidate to ClientB through Signling Server. ClientB forwards its Candidate to ClientA through Signaling Server according to the same logic.
- At this point, both ClientA and ClientB have received the Candidate of the other party and established a connection through PeerConnection. So far the P2P channel has been established.

#### RTCPeerConnection communication process :
-Step1: Install ICE Server -- use coturn 

-Step2: Start signaling service

-Step3: Use BimccWebRTC.js library

#### Clinet Refernce API :
```
var webrtc = BimccMultiRTC();

//WebSocket server connected
webrtc.on("connected", function (socket) {
    /*//create local stream
    webrtc.createStream({
      "video": true,
      "audio": true
    });*/
    webrtc.allReadyComplete();
});

//create local stream success
webrtc.on("stream_created", function(stream) {
  document.getElementById('me').src = URL.createObjectURL(stream);
  document.getElementById('me').play();
});

//create local stream fail
webrtc.on("stream_create_error", function() {
  alert("create stream failed!");
});

//receive other peers remote stream
webrtc.on('pc_add_stream', function(stream, socketId) {
  var newVideo = document.createElement("video"),
      id = "other-" + socketId;
  newVideo.setAttribute("class", "other");
  newVideo.setAttribute("autoplay", "autoplay");
  newVideo.setAttribute("id", id);
  videos.appendChild(newVideo);
  webrtc.attachStream(stream, id);
});

//remove other peers
webrtc.on('remove_peer', function (socketId) {
    var video = document.getElementById('other-' + socketId);
    if (video) {
        video.parentNode.removeChild(video);
    }
});

//recevie data channel message
webrtc.on('data_channel_message', function (channel, socketId, message) {
    /*var p = document.createElement("p");
    p.innerText = socketId + ": " + message;
    msgs.appendChild(p);*/
    // console.log(message);
    canvas.api.loadCanvasFromData(message);

});

//connect WebSocket server
webrtc.connect("ws://IP Address OR Domain:3000?room=room1", 'room1');

```
