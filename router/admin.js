const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { adminModel,validateAdminModel} = require("../models/admin");
const jwt = require("jsonwebtoken");
const {validateAdmin , userIsLoggedIn} = require("../middleware/adminValidate");
const {eventModel,validateeventModel} = require("../models/event")
const upload = require("../confrigation/multerconnection");
const { noticeModel, validateNoticeModel } = require("../models/notice");

router.get("/create",async(req,res)=>{

    let salt =await bcrypt.genSalt(10);
    let hash =await bcrypt.hash("admin",salt);

    let admin =await adminModel.create({
        name:"Priyadarshi",
        email:"admin123@gmail.com",
        password:hash
    })
    let token=  jwt.sign({email:"admin123@gmail.com "},process.env.JWT_KEY);
    res.cookie("token",token);
    res.send("admin created succesfully")
})

router.get("/login",(req,res)=>{
    res.render("adminlogin");
});

router.post("/login",async(req,res)=>{
    let {email,password} = req.body;
    let admin =await adminModel.findOne({email});

    if(!admin) return res.send("Admin not found");

    let valid = bcrypt.compare(password,admin.password);

    if(valid){
        let token=  jwt.sign({email:"admin123@gmail.com "},process.env.JWT_KEY);
    res.cookie("token",token);
    }
    res.redirect("/admin/dashboard")
})

router.get("/logout",(req,res)=>{
    let token=  jwt.sign({email:"admin123@gmail.com "},process.env.JWT_KEY);
    res.cookie("token","");
    res.redirect("/admin/login")
})

router.get("/dashboard",validateAdmin,(req,res)=>{
    res.render("event")
})

router.get("/event",validateAdmin,(req,res)=>{
    res.render("addEvent")
})

router.post("/event/add", validateAdmin,upload.single("eventLogo"),async (req, res) => {
    try {
        let { name, teamMemberLimit, prizeMoney, ageLimit,eventLogo } = req.body; // Ensure eventLogo is included in your form

        // Check if the event already exists
        let event = await eventModel.findOne({ name });
        if (event) return res.status(400).send("Event already exists");

        // Create new event
        event = await eventModel.create({
            name,
            teamMemberLimit,
            prizeMoney,
            ageLimit,
            eventLogo:req.file.buffer// This might be undefined unless you include it in the form
        });
        res.render("addSucess")
    } catch (err) {
        console.error('Error occurred:', err.message);
        return res.status(500).send(err.message);
    }
});

router.get("/allevent",validateAdmin,async(req,res)=>{
    try {
        const events = await eventModel.find();
      //  console.log(events)// Fetch all events
        res.render("allevent",{events}); // Return events as JSON
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: err.message }); // Handle error
    }
    
})

router.get("/delete/:id",validateAdmin,async(req,res)=>{
    let event = await eventModel.findOneAndDelete({_id:req.params.id})
     return res.redirect("/admin/allevent")
 
})

router.get("/notice",validateAdmin,(req,res)=>{
    res.render("addNotice")
})

router.post("/notice/add",validateAdmin,async(req,res)=>{
    let {notice} = req.body;

    let addnotice = await noticeModel.findOne({notice})
    if(addnotice) return res.send("notice allready created")

    addnotice = await noticeModel.create({
        notice,
        date:Date.now()
    })
    console.log(addnotice)
    res.redirect("/admin/notice/show")
})

router.get("/notice/show",async(req,res)=>{
    let notices = await noticeModel.find()
    res.render("notice",{notices})
})

router.get("/delete/notice/:id",validateAdmin,async(req,res)=>{
    let event = await noticeModel.findOneAndDelete({_id:req.params.id})
     return res.redirect("/admin/notice/show")
 
})




module.exports = router;