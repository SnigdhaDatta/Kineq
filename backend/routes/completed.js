const { Router }= require('express');
const completedRouter = Router();
const Folder = require('../models/folder');
const insideFolderRouter = require ('../controllers/contents');
const redisClient = require('../services/client');

// all the actions inside the folder will be directed to insideFolderRouter whose code is written in the contents folder
completedRouter.use('/:folderId/contents', insideFolderRouter);


completedRouter.post('/', async(req,res)=>{
    const {name, coverImageUrl} = req.body;
    try{
        if(!name) return res.status(400).json({error:'Folder Name is required'});
        const newFolder = await Folder.create({name, coverImageUrl, userId:req.user._id});
        await redisClient.del(`completed:${req.user._id}`);
        return res.status(201).json({message:'Folder created successfully', newFolder});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
})

completedRouter.get('/', async(req,res)=>{
    const allFolders = await Folder.find({userId:req.user._id});
    let cachedData= await redisClient.get(`completed:${req.user._id}`);
    if(cachedData){
        return res.status(200).json(JSON.parse(cachedData));
    }
    if(allFolders.length === 0){
        return res.status(404).json({error:'No Folders Created'});
    }
    await redisClient.set(`completed:${req.user._id}`, JSON.stringify(allFolders), "EX", 180, "NX");
    cachedData = await redisClient.get(`completed:${req.user._id}`);
    return res.status(200).json(JSON.parse(cachedData));
})

completedRouter.get('/:folderId', async(req,res)=>{
    const folderId = req.params.folderId;
    let cachedData= await redisClient.get(`completed:${folderId}:${req.user._id}`);
    if(cachedData){
        return res.status(200).json(JSON.parse(cachedData));
    }
    const folder = await Folder.findOne({ _id: folderId, userId: req.user._id });
    if(!folder) {
        return res.status(404).json({error:'No such Folder exists'});
    }
    await redisClient.set(`completed:${folderId}:${req.user._id}`, JSON.stringify(folder), "EX", 180, "NX");
    cachedData = await redisClient.get(`completed:${folderId}:${req.user._id}`);
    return res.status(200).json(JSON.parse(cachedData));
})

completedRouter.patch('/:folderId', async(req,res)=>{
    const folderId = req.params.folderId;
    const updatedItem = req.body;
    try{
        const toUpdate = await Folder.findOne({ _id: folderId, userId: req.user._id });
        if(!toUpdate){
            return res.status(404).json({error:'Folder not found'});
        }
        if(updatedItem.name && toUpdate.name !== updatedItem.name){
            toUpdate.name = updatedItem.name;
        }
        if (updatedItem.coverImageUrl && toUpdate.coverImageUrl !== updatedItem.coverImageUrl){
            toUpdate.coverImageUrl = updatedItem.coverImageUrl;
        }
        await redisClient.del(`completed:${req.user._id}`);
        await redisClient.del(`completed:${folderId}:${req.user._id}`);
        await toUpdate.save();
        return res.status(200).json({message:'Changes saved successfully'});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
})

completedRouter.delete('/:folderId', async(req,res)=>{
    const folderId = req.params.folderId;
    try{
        const deletedFolder = await Folder.findOneAndDelete({ _id: folderId, userId: req.user._id });
        if(!deletedFolder){
            return res.status(404).json({error:'Folder not found'});
        }
        await redisClient.del(`completed:${req.user._id}`);
        await redisClient.del(`completed:${folderId}:${req.user._id}`);
        return res.status(200).json({message:'Folder deleted successfully'});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
})

module.exports= completedRouter;
