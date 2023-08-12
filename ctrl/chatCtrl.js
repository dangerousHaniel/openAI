const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);
const natural = require("natural");
const stopword = require("stopword");
// const extractTopKeywords=require("./keywordCtrl");



const extractTopKeywords = async (text, topN = 10) => {

    const tokens = new natural.WordTokenizer().tokenize(text);
    const filteredTokens = stopword.removeStopwords(tokens).filter(token => /^[a-z0-9]+$/i.test(token));
    const frequency = {};
    filteredTokens.forEach(token => {
        token = token.toLowerCase();
        frequency[token] = (frequency[token] || 0) + 1;
    });
    const sortedKeywords = Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(entry => entry[0]);
    return sortedKeywords;
};



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
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



const chatTone = async (req, res, next) => {
    const newContent = req.newContent;
    try {
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: `What's the tone in ${newContent}.Respond concisely.` },
            ]
        });
        const tone = chatCompletion.data?.choices?.[0]?.message?.content || "";
        req.tone=await extractTopKeywords(tone);
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const chatTheme = async (req, res, next) => {
    const newContent = req.newContent;
    try {
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: `What's the theme in ${newContent}.Respond concisely.` },
            ]
        });
        const theme = chatCompletion.data?.choices?.[0]?.message?.content || "";
        req.theme=await extractTopKeywords(theme);
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




const chatTotal = async (req, res, next) => {
    chatObj = {};
    const newContent = req.newContent;
    const newContentLength = req.newContentLength;
    const tone=req.tone;
    const theme=req.theme;
    try {
        chatObj.Description = newContent;
        chatObj.Length = newContentLength;
        chatObj.Tone=tone;
        chatObj.Theme=theme;
        chatObj.TopKeywords = await extractTopKeywords(newContent);
        res.json(chatObj);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




module.exports = { chat, chatTotal, chatTone, chatTheme };