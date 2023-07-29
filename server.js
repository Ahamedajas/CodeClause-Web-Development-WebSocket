const express = require('express');
const app = express();
const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Store connected clients
const clients = new Set();

// Handle WebSocket connection
wss.on('connection', (ws) => {
  clients.add(ws);

  // Handle incoming messages from clients
  ws.on('message', (message) => {
    // Broadcast the message to all connected clients
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle disconnection
  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Create an HTTP server with Express
const server = app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});

// Upgrade the HTTP server to handle WebSocket requests
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
