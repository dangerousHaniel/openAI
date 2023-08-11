const express=require("express");
const { chat, chatKeywords } = require("../ctrl/chatCtrl");
router=express.Router();

router.post("/", [chat, chatKeywords]);

module.exports=router;