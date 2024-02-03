const express = require('express');
const router = require('./routes');
const {DB_URL, APP_PORT} = require('./config/index');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(DB_URL);
const db  = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=> {
    console.log('DB connected...');
})


app.use(cors());
app.use(express.json());
app.use("/api/v1", router);


app.listen(APP_PORT, ()=> console.log(`listening on port ${APP_PORT}`));