require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const mongoUrl = process.env.MONGODB_URI;

mongoose.connect(mongoUrl).then(() => {
    console.log("Connected to Database");
}).catch((e) => {
    console.log(e);
});

app.listen(5001, () => {
    console.log("Server started.");
});
