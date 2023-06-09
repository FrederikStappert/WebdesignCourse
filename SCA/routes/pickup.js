var express = require('express');
const User = require("../models/user");
const PickupOrder = require("../models/pickupOrder");
const Rating = require("../models/rating");
var router = express.Router();
const multer = require('multer');
const path = require("path");
var imageUrl = ""

var today = new Date();
var date ='';
if((today.getMonth()+1)<10){
    date = today.getFullYear()+'-0'+(today.getMonth()+1)+'-'+today.getDate()
}else{
    date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
}
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        imageUrl = Date.now() + path.extname(file.originalname)
        cb(null, imageUrl)
    }
})

const pickupOrder = multer ({storage:storage})


router.post('/pickupOrder', pickupOrder.single('uploadImage'), async (req, res)=>{
    const users = await User.findOne({username:req.session.user})
    const pickupOrder = new PickupOrder ({
        username: users.username,
        date: req.body.date,
        address: users.address,
        region: users.region,
        url: imageUrl,
        driver: '',
        status: 'requested'
    })

    await pickupOrder.save()
    res.redirect('/dashboard');
})

router.get('/pickupOrder',(req,res)=>{
    if(req.session.user){
        res.render('pickupOrder',{user:req.session.user})
    }else{
        res.send('Unauthorized User')
    }
})

router.get('/list', async(req, res) => {
    if(req.session.user){
        try {
            const pickups = await PickupOrder.find({status:'requested'}).sort({date:'asc',region:'asc'})
            console.log('pickupsList' + pickups)
            res.render('pickupsList', {pickups: pickups});
        }catch (err) {
            res.render('error')
        }
    }else{
        res.send('Unauthorized User')
    }
});

router.get('/selectedOrder', async(req,res)=>{
    if(req.session.user){
        res.render('index', { title: 'Login system' });
    }else{
        res.send('Unauthorized User')
    }
})

router.post('/list', async(req,res) =>{
    try{
        await PickupOrder.findByIdAndUpdate(req.body.id,{driver: req.session.user, status: 'accepted'})
        const pickups = await PickupOrder.find({status:'requested'}).sort({date:'asc',region:'asc'})
        res.render('pickupsList', {pickups: pickups, confirmation: 'Pickup selected' });
    }catch{
        res.send('Error')
    }
})

router.get('/myOrder', async(req, res) => {
    if(req.session.user){
        try {
            const pickups = await PickupOrder.find({driver:req.session.user}).sort({date:'asc',region:'asc'})
            console.log('pickupsList' + pickups)
            res.render('pickupsList', {pickups: pickups, driver: 'true'});
        }catch(err){
            res.render('error');
        }
    }else{
        res.send('Unauthorized User')
    }
});

router.post('/myOrder', async(req, res) => {
    try{
        await PickupOrder.findByIdAndUpdate(req.body.id,{ status: 'confirmed'})
        const pickups = await PickupOrder.find({driver:req.session.user}).sort({date:'asc',region:'asc'})
        res.render('pickupsList', {pickups: pickups, confirmation: 'Pickup confirmed' });
    }catch{
        res.send('Error')
    }
});

router.get('/userOrder', async(req, res) => {
    if(req.session.user){
        try {
            const pickups = await PickupOrder.find({username:req.session.user}).sort({date:'asc',region:'asc'})
            res.render('userPickups', {pickups: pickups});
        }catch(err){
            res.render('error');
        }
    }else{
        res.send('Unauthorized User')
    }
});

router.post('/userOrder', async(req, res) => {
    try{
        await PickupOrder.findByIdAndDelete(req.body.id)
        const pickups = await PickupOrder.find({username:req.session.user}).sort({date:'asc',region:'asc'})
        res.render('userPickups', {pickups: pickups, confirmation: 'Pickup deleted' });
    }catch{
        res.send('Error')
    }
});

router.post('/pickupRating',async(req,res)=>{
    try {
        const pickups = await PickupOrder.findById(req.body.id)
        res.render('ratingDriver', {pickups: pickups,url: pickups.url});
    }catch(err){
        res.render('error');
    }
});

router.post('/pickupRatingg',async(req,res)=>{
    try{
        const rating = new Rating ({
            username: req.body.driver,
            rating: req.body.rating,
            comment: req.body.comment
        })
        await rating.save()
        res.redirect('/dashboard')
    } catch{
        res.send('Æv var')
    }
});

router.get('/today', async(req, res) => {
    if(req.session.user){
        try {
            const pickups = await PickupOrder.find({status:{$ne:'requested'}, date: date, driver: req.session.user}).sort({region:'asc'})
            res.render('pickupsList', {pickups: pickups});
        }catch (err) {
            res.render('error')
        }
    }else{
        res.send('Unauthorized User')
    }
});

router.post('/today', async(req,res) =>{
    try{
        await PickupOrder.findByIdAndUpdate(req.body.id,{driver: req.session.user, status: 'confirmed'})
        const pickups = await PickupOrder.find({status:{$ne:'requested'},date: date, driver: req.session.user}).sort({region:'asc'})
        res.render('pickupsList', {pickups: pickups, confirmation: 'Pickup selected' });
    }catch{
        res.send('Error')
    }
})

module.exports = router;