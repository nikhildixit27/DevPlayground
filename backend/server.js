const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const Pusher = require("pusher");
const port = process.env.PORT || 5000;

const app = express();

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    useTLS: true,
});

// pusher.trigger("my-channel", "my-event", {
//     message: "hello world"
// });

app.use(cors());
// Middlewares - to parse JSON and URL encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = app.listen(port, () => {
    console.log(`Express server is running on PORT ${port}`);
});
