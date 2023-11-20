const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongodb = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const MongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb://localhost:27017'; // Update this URL with your MongoDB connection string
const dbName = 'shoppingListDB';

app.use(express.static('public')); // Assuming your HTML file is in a 'public' folder

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('createList', async (listCode) => {
    const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
      await client.connect();
      const db = client.db(dbName);
      const listsCollection = db.collection('lists');

      // Save the new list to MongoDB
      await listsCollection.insertOne({
        code: listCode,
        title: 'New List',
        items: ['Item 1', 'Item 2'],
      });

      socket.emit('joinList', listCode);
    } finally {
      await client.close();
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
