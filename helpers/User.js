
module.exports={
    users:[],
    activeUser(email,id){
      let newUser={email,id};
      this.users.push(newUser);
    },
    inActiveUser(user_id){
       
     let refinedUsers=this.users.filter(obj=>obj.id!==user_id);
     this.users=refinedUsers;   
    },
    getUserByEmail(email){
    let user=this.users.find(obj=>obj.email===email);
    return user;
    },
    getUserById(id){
      let user=this.users.find(obj=>obj.id===id);
      return user;
    },
    getActiveUsers()
    {    
        let basicInfo=this.users.map(obj=>({email:obj.email}));
        return basicInfo;
    }
}