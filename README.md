WebRTC Signaler
===============

The WebRTC Signaler is a Node.js service that facilitates signaling between peers to establish WebRTC connections. This service is used for managing the signaling phase in WebRTC-based applications where peers need to exchange SDP (Session Description Protocol) and ICE (Interactive Connectivity Establishment) candidates before establishing a direct peer-to-peer connection.

Features
--------

-   **WebSocket-based signaling:** Establishes a real-time connection between peers using WebSockets for efficient data exchange.
-   **User tracking:** Broadcasts the number of active users and assigns each user a unique identifier.
-   **Signaling Messages:** Handles WebRTC signaling (SDP and ICE candidate exchange) between peers.
-   **Cross-platform:** Can be used with any WebRTC-capable platform or application.

Requirements
------------

-   **Node.js**: `v14.0.0` or higher
-   **Socket.IO**: `v4.x.x`
-   **WebRTC client library**

Run the Signaler
------------
```sh
git clone [REPO_URL](https://github.com/dylwong/signaler.git)
cd signaler
npm install
npm start
```
