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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/update-editor", (req, res) => {
    pusher.trigger("editor", "text-update", {
        ...req.body,
    });

    res.status(200).send("OK");
});

const server = app.listen(port, () => {
    console.log(`Express server is running on PORT ${port}`);
});
