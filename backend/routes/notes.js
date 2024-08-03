var express = require('express');
const authenticateToken = require('../middleware/fetchuser');
var router = express.Router();
const {
    body,
    validationResult
} = require("express-validator");
const {
    Note,
    Category,
    CategoryReference
} = require("../models/Notes");
const { SaveNote,SaveCategory,GetAllCategory,GetAllNotesByCategory,GetAllNotesByUser, RemoveNote } = require('../common/NoteMethods');

router.post('/AddNote',[body("catgory", "Catgeory Name Cannot Be Blank").exists(),
    body("content", "Content Cannot Be Blank").exists(),
    body("title", "title Cannot Be Blank").exists() ],
    authenticateToken,
    async (req, res) => {
        try{
        const _error = validationResult(req);
        if (!_error.isEmpty()) {
            res
                .status(400)
                .json({
                    error: _error.array().map((x) => x.path + " " + x.msg)
                });
        } else {
            const {
                catgory,
                title,
                content
            } = req.body;
            let _id = req.body.UserId;  
            console.log('id',_id);
            let _Result=await SaveNote({
                title:title,
                category:catgory,
                content:content,
                Id:null
            },_id);
            console.log('_Result',_Result)
            console.log('!(_Result?.message?.includes(0:))',!(_Result?.message?.includes('0:')))
            res.json({message:_Result.message,success:!(_Result?.message?.includes('0:'))})
        }

    }
    catch(ex)
    {
        res.json({message:ex.message})
    }
    });

router.post('/AddCategory',[body("catgory", "Catgeory Name Cannot Be Blank").exists()],
        authenticateToken,
        async (req, res) => {
            try{
            const _error = validationResult(req);
            if (!_error.isEmpty()) {
                res
                    .status(400)
                    .json({
                        error: _error.array().map((x) => x.path + " " + x.msg)
                    });
            } else {
                const { catgory } = req.body;
                let _id = req.body.UserId;  
                let _Result=await SaveCategory({
                    name:catgory,
                    user:req.body.UserId
                });
                res.json({message:_Result.message})
            }
    
        }
        catch(ex)
        {
            res.json({message:ex.message})
        }
        });
router.post('/RemoveNote',[body("note", "Could Not Find Note").exists()],
        authenticateToken,
        async (req, res) => {
            try{
            const _error = validationResult(req);
            if (!_error.isEmpty()) {
                res
                    .status(400)
                    .json({
                        error: _error.array().map((x) => x.path + " " + x.msg).join(' ')
                    });
            } else {
                const { note } = req.body;
                let _Result=await RemoveNote(
                    note,req.body.UserId
                );
                res.json({message:_Result.message})
            }
    
        }
        catch(ex)
        {
            res.json({message:ex.message})
        }
        });
    
router.get('/GetAllCategory',authenticateToken, async (req, res) => {
    let userId=req.body.UserId;
    let Result=await GetAllCategory(userId);
    res.status(200).json(Result);
});
router.get('/GetAllNotesByUser',authenticateToken, async (req, res) => {
    let userId=req.body.UserId;
    console.log('PageNo',parseInt(req.query.Page))
    let Result=await GetAllNotesByUser(userId,'',parseInt(req.query.Page));
    res.status(200).json(Result);
});


router.get('/GetAllNotesByCategory',authenticateToken,async (req, res) => {
    let Result=await GetAllNotesByCategory(req.body.UserId,req.query.category);
    res.status(200).json(Result);
});

router.post('/GetAllNotesByCategory',authenticateToken,async (req, res) => {
    const { category ,UserId } = req.body;
    let Result=await GetAllNotesByCategory(UserId,category);
    res.status(200).json(Result);
});








module.exports = router;