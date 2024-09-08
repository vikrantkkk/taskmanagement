import { io } from 'socket.io-client';

// Create a Socket.io connection
const socket = io('http://localhost:5000', {
  transports: ['websocket'], // Ensure the WebSocket transport is used
  withCredentials: true, // If using credentials with CORS
});

// Listen for notifications
socket.on('receiveNotification', (notification) => {
  console.log('Notification received:', notification);
});
