const tavilyClient = require('../services/tavilySearch');
const { Router }= require('express');
const chatbotRouter = Router();

chatbotRouter.post('/', async(req,res)=>{
    const { query }= req.body;
    const response = await tavilyClient.search(query,{
        includeAnswer: "basic",
        searchDepth: "basic",
        country: "india"
    });
    if(!response || !response.answer){
        return res.status(404).json({ error: "No relevant information found for the query" });
    }
    res.status(200).json(response);
});

module.exports = chatbotRouter;
