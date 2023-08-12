const express=require("express");
const { chat, chatTone, chatTheme, chatTotal } = require("../ctrl/chatCtrl");
router=express.Router();

router.post("/", [chat,[chatTone, chatTheme], chatTotal]);

module.exports=router;