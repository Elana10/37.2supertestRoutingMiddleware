const express = require('express');
const router = new express.Router();
const ExpressError = require('./expressError');
const items = require('./fakeDb');

router.get('/', (req, res)=>{
    return res.json({items});
});

router.get('/:name', (req,res,next)=>{
    try{
        const foundItem = items.find( i => i.name === req.params.name)
        if(foundItem === undefined){
            throw new ExpressError("Item not found.", 404)
        }
        return res.json({item: foundItem})        
    } catch(e){
        next(e);
    }
})

router.post('/', (req,res, next)=>{
    try{
        if (!req.body.name) throw new ExpressError("Item is required.", 400)
        const newItem = {
            name : req.body.name,
            price : req.body.price,
        }
        items.push(newItem)
        return res.status(201).json({
            added : newItem
        })
    } catch(e){
        return next(e)
    }
})

router.patch('/:name', (req, res, next) =>{
    const foundItem = items.find(i => i.name === req.params.name)
    if (foundItem === undefined){
        throw new ExpressError("Item not found", 404)
    }
    foundItem.name = req.body.name
    return res.json({ updated : foundItem})
})

router.delete('/:name', (req,res,next) => {
    const foundItem = items.findIndex(i => i.name === req.params.name)
    if (foundItem === -1){
        throw new ExpressError("Item not found", 404)
    }
    items.splice(foundItem, 1)
    return res.json({message: "Deleted"})
})

module.exports = router;