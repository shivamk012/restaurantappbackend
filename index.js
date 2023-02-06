import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import express from 'express';
import cors from "cors";
import {insertUser , login , updateCart , addProduct , sendRequest , getRequestArr} from './services.js';
import bodyparser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// require('./routes')(app)
app.use(cors());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./build")));

const port = process.env.PORT || '8000';

let dbClient = null;

app.get(/^(?!\/api).+/, (req,res)=>{
    res.sendFile(path.join(__dirname, './build/index.html'));
})

async function main(){
    console.log(port);
    const uri = process.env.MONGODB;
    console.log(uri);
    const client = new MongoClient(uri);
    try{
        await client.connect();

        dbClient = client;
        console.log('connected');
    }catch(err){
        console.log(err);
    }
}

async function getData(){
    let food = await dbClient.db('FoodItems').collection('Food').find().toArray();
    // console.log(food);
    return food;
}

app.get('/api/getFood', (req,res)=>{
    getData().then(res1=>{
        res.send(res1);
    });
})

app.post('/api/setUser' , (req,res)=>{
    insertUser(dbClient , req.body).then((res1)=>{
        // console.log(res1);
        // res1.data = res1.insertedId;
        res.send(res1);
    })
})

app.post('/api/loginUser' , (req,res)=>{
    login(dbClient , req.body).then((res1)=>{
        res.send(res1);
    })
})

app.post('/api/updateCart' , (req,res)=>{
    updateCart(dbClient , req.body).then((res1)=>{
        res.send(res1);    
    })
})

app.post('/api/addNewProduct' , (req,res)=>{
    addProduct(dbClient , req.body).then((res1)=>{
        console.log(res1);
        res.send(res1);
    });
})

app.post('/api/requestOrder' , (req,res)=>{
    sendRequest(dbClient , req.body).then((res1)=>{
        console.log(res1);
        res.send(res1);
    });
})

app.get('/api/getRequest' , (req,res)=>{
    getRequestArr(dbClient).then((res1)=>{
        res.send(res1);
    })
})

async function setRequestData(data){
    console.log(data);
    const cursor = await dbClient.db("FoodItems").collection("User").findOne({
        isAdmin : true
    });
    const result = await dbClient.db("FoodItems").collection("User").updateOne({_id:cursor._id} , {$set:{
        request : data
    }});
    return result;
}

app.post('/api/setRequest' , (req,res)=>{
    setRequestData(req.body).then((res1)=>{
        res.send(res1);
    });
})

main();
app.listen(port);