
var socket=io();
let isTyping=false;

// this is for tracking specific file that you have send
const filesId=[];

//selectors
const userList=document.querySelector('.users-list');
const messageContainer=document.querySelector('.message-container');
const imgFile=document.querySelector('#img-file');




let useremail=null;

window.addEventListener('DOMContentLoaded',()=>{
const {email}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
useremail=email;
if(useremail)
{
document.querySelector('#user').innerHTML='<span class="fa fa-user" style="color:limegreen;"></span>&nbsp;'+useremail;    
socket.emit('set-active-user',useremail);
}
});


socket.on('activeUsers',(users)=>{
    userList.innerHTML='';
  users.forEach(obj=>{
      if(obj.email!=useremail)
      {
      let li=document.createElement('li');
      li.setAttribute('onclick',`setSendTo('${obj.email}')`)
      li.innerHTML='<span class="fa fa-user" style="color:limegreen;"></span>&nbsp;'+obj.email;
      userList.appendChild(li);
      }
  })  

})


function setSendTo(email)
{
    document.querySelector('#sendto').value=email;
} 

document.querySelector('#msg').addEventListener('input',()=>{
isTyping=true;
let typeFor=document.querySelector('#sendto').value
if(isTyping)
{
    socket.emit('type',{email:typeFor,message:document.querySelector('#msg').value});
}
});

socket.on('typing',info=>{
    console.log(info);
    document.querySelector('#typeInfo').innerText=info;    
});

function sendMessage()
{
let msg=document.querySelector('#msg').value;
let to=document.querySelector('#sendto').value
let your=document.createElement('div');
your.classList.add('your');

let time=document.createElement('span');
time.setAttribute('id','time');
time.innerText=new Date().toLocaleTimeString();

let message=document.createElement('div');
message.classList.add('message');

let label=document.createElement('label');
label.innerText='you';

let span=document.createElement('span');
span.innerText=msg;
if(msg)
{
your.appendChild(time);
message.appendChild(label);
message.appendChild(span);
your.appendChild(message);
messageContainer.appendChild(your);
socket.emit('send',{from:useremail,to:to})
document.querySelector('#msg').value='';
}

}


function sendMessage()
{
let msg=document.querySelector('#msg').value;
let to=document.querySelector('#sendto').value
let your=document.createElement('div');
your.classList.add('your');

let time=document.createElement('span');
time.setAttribute('id','time');
time.innerText=new Date().toLocaleTimeString();

let message=document.createElement('div');
message.classList.add('message');

let label=document.createElement('label');
label.innerText='you';

let span=document.createElement('span');
span.innerText=msg;
if(msg)
{
your.appendChild(time);
message.appendChild(label);
message.appendChild(span);
your.appendChild(message);
messageContainer.appendChild(your);
socket.emit('send',{to:to,msg:msg});
document.querySelector('#msg').value='';
socket.emit('type',{email:to,message:document.querySelector('#msg').value});
}

}

socket.on('message',({from,msg})=>{

    console.log(from);

    let other=document.createElement('div');
    other.classList.add('other');
    
    let time=document.createElement('span');
    time.setAttribute('id','time');
    time.innerText=new Date().toLocaleTimeString();
    
    let message=document.createElement('div');
    message.classList.add('message');
    
    let label=document.createElement('label');
    label.innerText=from;
    
    let span=document.createElement('span');
    span.innerText=msg;
    if(msg)
    {
    other.appendChild(time);
    message.appendChild(label);
    message.appendChild(span);
    other.appendChild(message);
    messageContainer.appendChild(other);
    }
});

imgFile.addEventListener('change',(event)=>{

    const file=event.target.files[0];
    const fr=new FileReader();
    const file_id='file'+Date.now()+'id';

    fr.onloadend=()=>{
    const image=document.createElement('div');
    image.classList.add('send--image');
    const img=document.createElement('img');
    img.src=fr.result;
    image.appendChild(img);

    const info=document.createElement('div');
    info.classList.add('info');
    const download=document.createElement('a');
    download.setAttribute('href',fr.result);
    download.setAttribute('class','fas fa-file-download');
    download.setAttribute('download',Date.now()+file.name);
    info.appendChild(download);
    const status=document.createElement('span');
    status.setAttribute('id',file_id);
    status.innerText='sending';
    info.appendChild(status);

    image.appendChild(info);
    messageContainer.appendChild(image);
    filesId.push(file_id);
    sendImageFile(file,file_id);
    };

    fr.readAsDataURL(file);

});


function sendImageFile(file,file_id)
{
    const fr=new FileReader();

    fr.onloadend=()=>{

        const setObj={
            file_id,
            data:fr.result,
            to:document.querySelector('#sendto').value,
            file_name:file.name
        }

        socket.emit('sendImageFile',setObj);

    }

    fr.readAsArrayBuffer(file);
}

socket.on('receivedImageFile',(data,file_name,from,file_id)=>{

console.log(file_name);
let imageUrl=`data:image/jpeg;base64,${data}`;
const image=document.createElement('div');
image.classList.add('received--image');
const img=document.createElement('img');
img.src=imageUrl;
image.appendChild(img);

const info=document.createElement('div');
info.classList.add('info');
const download=document.createElement('a');
download.setAttribute('href',imageUrl);
download.setAttribute('class','fas fa-file-download');
download.setAttribute('download',Date.now()+file_name);
info.appendChild(download);
const status=document.createElement('span');
status.innerText=from;
info.appendChild(status);
image.appendChild(info);
messageContainer.appendChild(image);

socket.emit('imageFileIsReceived',from,file_id);


});

socket.on('ImageReceived',(id)=>
{
    document.querySelector(`#${id}`).innerText='send';
})