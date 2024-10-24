const express = require("express");
const router = express.Router();
const passport = require("passport")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const  {userModel,registerValidation, loginValidation} = require("../models/user")
const {eventModel,validateeventModel} = require("../models/event")
const {myEventModel,validateMyEvent}=require("../models/myevent")
const {validateAdmin , userIsLoggedIn} = require("../middleware/adminValidate");

router.get("/",(req,res)=>{
    res.render("userlogreg");
})

router.post("/register",async(req,res)=>{
    let {name,email,password} = req.body;

    let user = await userModel.findOne({email})
    if(user) return res.send("user allready exist")

        let salt =await bcrypt.genSalt(10);
        let hash =await bcrypt.hash(password,salt)
    user = await userModel.create({
        name,
        email,
        password:hash,
    })
    user.save();

    let token = jwt.sign({email},process.env.JWT_KEY);
    res.cookie("token",token);
    res.redirect("/users/allevent")
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/users/profile', // Redirect on successful login
    failureRedirect: '/login', // Redirect back to the login page on failure
    failureFlash: false // Optionally, enable flash messages for better user feedback
}));
    
router.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.redirect("/users")
})

router.get("/profile",userIsLoggedIn,(req,res)=>{
    
    res.render("profile")
})

router.get("/allevent",userIsLoggedIn,async(req,res)=>{
    try {
        const events = await eventModel.find();
      //  console.log(events)// Fetch all events

        res.render("alleventuser",{events}); // Return events as JSON
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: err.message }); // Handle error
    }
})

router.get("/inrolle",userIsLoggedIn,async(req,res)=>{
    
    let myevent = await myEventModel.find({user:req.session.passport.user})
    res.send(myevent)
})

router.get("/inrolle/:id",userIsLoggedIn,async(req,res)=>{
    try{
        let myevent = await myEventModel.findOne({user:req.session.passport.user});
        let events = await eventModel.findOne({_id:req.params.id})
    if(!myevent){
        myevent = await myEventModel.create({
            user:req.session.passport.user ,
            event :[req.params.id],
            enrolledDate:Date.now()
        })
    }
    else{
        myevent.event.push(req.params.id)
        

       await myevent.save()
    }
    res.redirect("/users/myevent");
    }
    catch(err){
        res.send(err.message)
    }

})

router.get("/myevent",userIsLoggedIn,async (req,res)=>{
    let myevent = await myEventModel.findOne({user:req.session.passport.user}).populate("event");

    res.render("myevent",{myevent})
})

router.get("/delete/myevent/:id",userIsLoggedIn,async(req,res)=>{
    let myevent = await myEventModel.findOne({user:req.session.passport.user});
    
if(!myevent){
   return res.send("nothing in the cart")
}
else{
    let eventId = myevent.event.indexOf(req.params.id);
    myevent.event.splice(eventId,1);

    myevent.save();
}

    res.redirect("back")
 
})




module.exports = router;