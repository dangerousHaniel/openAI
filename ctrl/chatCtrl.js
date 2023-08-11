const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);


const chat = (async (req, res, next) => {
    let { role, content } = req.body;

    try {
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: role, content: content }]
        });
        const newContent = chatCompletion.data?.choices?.[0]?.message?.content || "";
        let newContentLength = newContent.length;
        req.newContent = newContent;
        req.newContentLength = newContentLength;
        // res.json([newContent, newContentLength]);
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const chatKeywords = async (req, res) => {
    chatObj = {};
    const newContent = req.newContent;
    const newContentLength = req.newContentLength;
    try {
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: `find the top 5 keywords in ${newContent}` },
                ]
        });
        // { role: "user", content: `whats the tone of ${newContent}` }
        const topKeywords = chatCompletion.data?.choices?.[0]?.message?.content || "";
        // const tone=chatCompletion.data?.choices?.[1]?.message?.content || "";
        chatObj.Description = newContent;
        chatObj.Length = newContentLength;
        chatObj.Keywords = topKeywords;
        // chatObj.Tone=tone;
        res.json(chatObj);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




module.exports = { chat, chatKeywords };