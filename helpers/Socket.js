const { getUserByEmail } = require('./User');
const user=require('./User');
const ab2str=require('arraybuffer-to-string');

const socketControl=function(socket,io){
    console.log('User Connected');
    socket.on('set-active-user',(email)=>{ 
        user.activeUser(email,socket.id)
       io.emit('activeUsers',user.getActiveUsers());
    });
  
    socket.on('type',({email,message})=>{
    
    let typingFor=user.getUserByEmail(email);

    if(typingFor)
    {
    if(message!=='')
   socket.to(typingFor.id).emit('typing',`${typingFor.email} is typing`);
   else
   socket.to(typingFor.id).emit('typing',``);
    }
    });
   
    socket.on('send',({to,msg})=>{
     
    let sender=user.getUserById(socket.id);
    if(sender)
    {  
   let receiver=user.getUserByEmail(to);
   if(receiver)
   {
    socket.to(receiver.id).emit('message',{from:sender.email,to:receiver.email,msg});
   } 
    }    
    });

    socket.on('sendImageFile',({file_id,data,to,file_name})=>{
        
        let sender=user.getUserById(socket.id);
        const receiver=user.getUserByEmail(to);
        socket.to(receiver.id).emit('receivedImageFile',ab2str(data,'base64'),file_name,sender.email,file_id);

    });

    socket.on('imageFileIsReceived',(from,file_id)=>{
        const receiver=user.getUserByEmail(from);
        socket.to(receiver.id).emit('ImageReceived',file_id);

    })


    socket.on('disconnect',()=>{ 
        user.inActiveUser(socket.id) 
        io.emit('activeUsers',user.getActiveUsers());
    });
}

module.exports.socketControl=socketControl;