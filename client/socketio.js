import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your server URL

// Listen for notifications
socket.on('receiveNotification', (notification) => {
  console.log('Notification received:', notification);
  // Update the notification dashboard here
});

// Example of sending a notification
function sendNotification(notification) {
  socket.emit('sendNotification', notification);
}
