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

let users = [];
let userEmails = [];

// Listen for WebSocket connections
io.on('connection', (socket) => {
    console.log('User connected');
    
    // Handle user registration and save their email
    socket.on('register_user', (data) => {
        console.log('User registered with email:', data.email);
        users.push(socket.id);
        userEmails.push(data.email); // Store the email address

        // Broadcast updated user info (emails) to all connected clients
        io.emit('user_count', { activeUserEmails: userEmails });
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
        const index = users.indexOf(socket.id);
        if (index !== -1) {
            users.splice(index, 1);
            userEmails.splice(index, 1); // Remove the user's email when they disconnect
        }
        io.emit('user_count', { activeUserEmails: userEmails });
    });

    // Handle signaling data from users (offer/answer/candidate)
    socket.on('signal', (data) => {
        io.to(data.target).emit('signal', {
            from: socket.id,
            ...data.signal,
        });
    });

    // Send the socket ID back to the client
    socket.emit('connected', { id: socket.id });
});

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
