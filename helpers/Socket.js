const { getUserByEmail } = require('./User');
const user=require('./User');

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


    socket.on('disconnect',()=>{ 
        user.inActiveUser(socket.id) 
        io.emit('activeUsers',user.getActiveUsers());
    });
}

module.exports.socketControl=socketControl;