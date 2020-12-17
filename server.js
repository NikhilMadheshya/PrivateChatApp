
const path=require('path');
const express=require('express');
const http=require('http');
const socketIO=require('socket.io');
const {socketControl}=require('./helpers/Socket');


//socket server setup
const app=express();
const server=http.createServer(app);
const io=socketIO(server);

// static file serving setup
app.use(express.static(path.join(__dirname,'public')));


app.get('/',(request,response)=>{
response.sendFile(path.join(__dirname,'templates','subscribe.html'));
});

app.get('/welcome',(request,response)=>{
    response.sendFile(path.join(__dirname,'templates','welcome.html'));
});


//socket events setup
io.on('connection',(socket)=>socketControl(socket,io));



const PORT=process.env.PORT || 4000;

server.listen(PORT,()=>console.log(` App is running at http://localhost:${PORT}`));
