const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const cors = require('cors');

const {mongoose} = require('./db/mongoose');
const {Memes} = require('./models/memes');
const { ObjectID } = require('mongodb');
const { request } = require('express');
const app = express()


const port = process.env.PORT || 8081

app.use((req, res, next) =>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,HEAD");
    next();
  });

 
app.post('/memes', (req, res) => {
    var meme= new Memes({
        name:req.body.name,
        url:req.body.url,
        caption:req.body.caption
    })

    Memes.findOne({
        "name": req.body.name,
        "url":req.body.url,
        "caption":req.body.caption
    })
    .then((result) => {
        if(result){
            return res.status(409).send()
        }

        meme.save().then((doc) => {
            res.send(doc)
        },(err) => {
            res.status(400).send(err)
        })
    })
    .catch((err) => {
        res.status(404).send()
    })
});


app.get("/memes", (req, res,next) => {
    var mysort={_id:-1}
    Memes.find()
    .sort(mysort)
    .then((memes) => {
        res.status(200).
        send({
            memes
        })
    },
    (err) => {
        res.status(400).send(err)
    })
});

app.get('/memes/:id', (req, res) => {
    var id= req.params.id
    if(!ObjectID.isValid(id)){
        return res.status(404).send()
    }

    Memes.findById(id)
    .then((meme) => {
        if(!meme){
            return res.status(404).send()
        }
        res.send(meme)
    },(err) => {
        res.status(404).send()   
    })
});

app.patch("/memes/:id", (req, res) => {
    var id = req.params.id
    var body = _.pick(req.body, ['url','caption']) 

    if(!ObjectID.isValid(id)){
        return req.status(404).send()
    }

    Memes.findByIdAndUpdate(id,{
        $set: body
    },{
        new:true
    })
    .then((meme) => {
        if(meme.length){
            return res.status(404).status();
        }

        res.send({
            meme
        })
    })
    .catch((err) => {
        res.status(404).send()
    })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports ={
    app
}
  

