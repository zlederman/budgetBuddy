const express = require('express')
const http = require('http')
const path = require('path')
const mongoose = require("mongoose");
const app = express()
const smsRoute= require('./routes/sms.route').router
const budgetRoute = require('./routes/budget.route')
const bodyParser = require('body-parser')
const summaryJob = require('./jobs/weekly.job')
require('dotenv').config()

const uri = `mongodb+srv://${process.env.NAME}:${process.env.PASS}@cluster0.kgaoe.mongodb.net/db?retryWrites=true&w=majority`;
mongoose.connect(uri,{ 
        useNewUrlParser: true,
        useUnifiedTopology: true })
        .then(()=>console.log('connected'))
        .catch((err)=> console.log(err))

        
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'frontend','build')))

app.get('/',(req,res)=>{
    console.log(req)
    res.sendFile(path.join(__dirname,'frontend','build','index.html'))
})
app.use('/api/sms',smsRoute)
app.use('/api/budget',budgetRoute)
summaryJob.start()

http.createServer(app).listen(80,async ()=>{
    console.log('Express is up!')
})

