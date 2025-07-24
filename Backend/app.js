//ENNGswYJaHT1PtH9

const express = require("express");
const mongoose = require("mongoose");


const app = express();

//Middleware
app.use("/",(req, res, next) => {
    res.send("It is working")
})



mongoose.connect("mongodb+srv://admin:ENNGswYJaHT1PtH9@cluster0.mjltbxo.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err) => console.log((err)));
