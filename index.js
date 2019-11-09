const express = require('express');
const bodyParser = require('body-parser');
const app= express()
app.use(bodyParser.json())
var SSE = require('express-sse');
var sse= new SSE()
function sseDemo(req, res){
    let messageId=0 
    const intervalId= setInterval(() => {
        res.write(`id: ${messageId}\n`)
        res.write(`data: Test Message -- ${Date.now()}\n\n`);
        messageId += 1;        
    }, 1000);
    req.on('close', () => {
        clearInterval(intervalId);
    });
}

app.get('/event-stream', (req, res)=>{ 
    console.log("received request");
    
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Access-Control-Allow-Origin' : '*'
    })
    res.write('\n')
    sseDemo(req,res)
})
app.get('/stream', sse.init)

app.post('/message', (req,res)=>{
    const body= req.body
    console.log(body.message)
    sse.send(body.message, body.chatId);
})
app.listen(3000, ()=>console.log("listening on port 3000"))