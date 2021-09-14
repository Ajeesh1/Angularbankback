
const db= require('./db')

users = {
    1000: { acno: 1000, username: "Aahil", password: "userone", balance: 5000, transaction: [] },
    1001: { acno: 1001, username: "Abhinav", password: "usertwo", balance: 6000, transaction: [] },
    1002: { acno: 1002, username: "Laisha", password: "userthree", balance: 7000, transaction: [] },
    1003: { acno: 1003, username: "Riddhieka", password: "userfour", balance: 8000, transaction: [] },
}

const register = (acno, username, password) => {

    return db.User.findOne({acno})
    .then(user=>{
        if(user){
            return{
                statusCode: 422,
                status: false,
                message: "user exist.... please login"
            }
        }
        else{
            const newUser=new db.User({
                acno,
                username,
                password,
                balance: 0,
                transaction: []
            })
            newUser.save()
            return{
                statusCode: 200,
                status: true,
                message: "Successfully registered"
            }
        }
        
    })


   

}



const login = (req,acno, pswd) => {
    return db.User.findOne({
        acno,
        password:pswd
    })

    .then(user=>{
        if(user){
            req.session.currentAcc = user.acno

            return {
                statusCode: 200,
                status: true,
                message: "Successfully login",
                userName:user.username,
                currentAcc:user.acno
            }
        }

        return {
            statusCode: 422,
            status: false,
            message: "invalid user"
        }
        
    })

   

}




const deposit = (acno, pswd, amount) => {



    var amt = parseInt(amount)

return db.User.findOne({
    acno,
    password:pswd
})
.then(user=>{
    if(!user){
        return {
            statusCode: 422,
            status: false,
            message: "invalid user"
        } 
    }

    user.balance=user.balance + amt
    user.transaction.push({
        amount: amt,
        type: "credit"
    })
    user.save()
    return {
        statusCode:200,
        status: true,
        message: amt+ "Successfully deposited and new balance is:"+user.balance
    }
})



}





const withdraw=(req,acno,pswd,amount)=>{

   
  
  var amt= parseInt(amount)


 
   return db.User.findOne({
      acno,
      password:pswd
  })
  .then(user=>{
    if(!user){
        return {
            statusCode: 422,
            status: false,
            message: "invalid user"
        } 
    }
    if(req.session.currentAcc != user.acno){
        return {
            statusCode: 422,
            status: false,
            message: "Operation denied"
        }   
      }
    if(user.balance<amt){
        return {
            statusCode: 422,
            status: false,
            message: "insufficient balance"
        }
    }
    user.balance=user.balance - amt
    user.transaction.push({
        amount: amt,
        type: "debit"
    })
    user.save()
    return {
        statusCode:200,
        status: true,
        message: amt+ "Successfully debited and new balance is:"+user.balance
    }  
  })
  
    
  
  
  }


  const getTransaction = (acno)=>{

    return db.User.findOne({
        acno
    })
    .then(user=>{
        if(user){
            return{
                statusCode:200,
                status: true,
                transaction:user.transaction 
            }
            
        }
        else{
            return {
                statusCode: 422,
                status: false,
                message: "invalid Operation"
            }  
        }
    })
    
    
     
     
   }


   const deleteAcc=(acno)=>{
       return db.User.deleteOne({
           acno
       }).then(user=>{
           if(!user){
            return {
                statusCode: 422,
                status: false,
                message: " Operation failed"
            } 
           }
           return{
            statusCode:200,
            status: true,
            message:"Account Number" +acno+ "deleted successfully "
        }

       })
   }



module.exports = {
    register,
    login,
    deposit,
    withdraw,
    getTransaction,
    deleteAcc
}