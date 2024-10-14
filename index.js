// Import the required modules
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

// Initialize the Express app and the HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Apply CORS for all routes
app.use(cors());

app.get('/', (req, res) => {
    res.send('WebRTC Signaling Server is running.');
});

let users = 0;

// Listen for WebSocket connections
io.on('connection', (socket) => {
    console.log('User connected');
    users++;

    // Broadcast the updated user count to all connected clients
    io.emit('user_count', { count: users });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
        users--;
        io.emit('user_count', { count: users });
    });

    // Handle signaling data from users (offer/answer/candidate)
    socket.on('signal', (data) => {
        // Send signaling data to the target peer
        io.to(data.target).emit('signal', {
            from: socket.id,
            ...data.signal,
        });
    });

    // Send the socket ID back to the client
    socket.emit('connected', { id: socket.id });
});

// Start the server on the Vercel environment's port or 3000 locally
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
