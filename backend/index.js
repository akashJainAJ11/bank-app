const express = require('express');
const router = require('./routes');
const { DB_URL, APP_PORT } = require('./config/index');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

try {
    // Attempt to connect to the database
    mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
        console.log('DB connected...');
    });

    // Set up middleware
    app.use(cors());
    app.use(express.json());
    app.use("/api/v1", router);

    // Start the server
    app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}`));

} catch (error) {
    // Handle any errors that occurred during setup
    console.error('Error during setup:', error);
}
