const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');


// global variables
const PORT = process.env.PORT || 8080;
const URI = "mongodb+srv://allblogsdata:%40Hanish870807@cluster0.tdruxdp.mongodb.net/pxdNGL?retryWrites=true&w=majority"

// common middlewares
app.use(cors());
app.use(express.json());

// function to connect database
const connectDB = async()=>{
    try {
        console.log('Connecting to Database...');
        await mongoose.connect(URI)
        .then(()=>console.log('Connected to Database'))
        .catch(()=>{
            console.log('Connection Failed');
            console.log('Connecting to database in 5 seconds...');
            setTimeout(() => {
                connectDB();            
            }, 5000);
        })
        
    } catch (error) {
        console.log('Try-Catch Failed.');
        console.log('Connecting to database in 5 seconds...');
        setTimeout(() => {
            connectDB();            
        }, 5000);
    }
}
connectDB()


// model and its schema for the messages
const msgSchema = new mongoose.Schema({
    platform: String,
    appName: String,
    appVersion: String,
    deviceMemory: Number,
    message: String,
    date: String,
    read: Boolean
})
const Msgs = new mongoose.model("msgs",msgSchema);

// api to save msg
app.post('/send', async (req,res)=>{
    console.log('Confession:',req.body.message);
    console.log("Time:",req.body.date);
    const response = await Msgs.create(req.body);
    response ? res.send(true): res.send(false)
})

// api to get msg
app.get('/', async(req,res)=>{
    const response = await Msgs.find({});
    response.length !== 0 ? res.send(response): res.send([])
})

// api to mark msg as red
app.post('/markRead', async (req,res)=>{
    console.log(req.body);
    const response = await Msgs.updateOne(req.body,{read:true});
    console.log(response);
    response.modifiedCount != 0 ? res.send(true): res.send(false)
})


app.listen(PORT,()=>{
    console.log('Server live on PORT:',PORT);
})

