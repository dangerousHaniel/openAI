const bodyParser = require("body-parser");
const express=require("express");
const app=express();
const dotenv = require("dotenv").config({ path: ".env" });
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const chatRouter=require("./router/chatRouter");

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/chat", chatRouter);


app.listen(PORT, ()=>{
    console.log("I'm up, brev");
});


