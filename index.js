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

// Store user data (email, name, profile)
let users = [];

// Listen for WebSocket connections
io.on('connection', (socket) => {
    console.log('User connected');

    // Handle user registration and save their email, name, and profile
    socket.on('register_user', (data) => {
        console.log(`User registered: Email: ${data.email}, Name: ${data.name}, Profile: ${data.profile}`);
        
        // Add the user details to the users array, including socket ID for tracking
        users.push({
            id: socket.id,
            email: data.email,
            name: data.name,
            profile: data.profile
        });

        // Broadcast updated user info (emails, names, and profiles) to all connected clients
        const activeUsers = users.map(user => ({
            email: user.email,
            name: user.name,
            profile: user.profile
        }));
        io.emit('user_count', { activeUsers }); // Send all active users' info to clients
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');

        // Find and remove the user by socket ID
        users = users.filter(user => user.id !== socket.id);

        // Update the active users list and broadcast the updated list
        const activeUsers = users.map(user => ({
            email: user.email,
            name: user.name,
            profile: user.profile
        }));
        io.emit('user_count', { activeUsers }); // Send all active users' info to clients
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

