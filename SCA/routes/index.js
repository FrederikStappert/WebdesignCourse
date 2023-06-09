var express = require('express');
const User = require("../models/user");
const PickupOrder = require("../models/pickupOrder");
const Rating = require('../models/rating')
const bodyparser = require("express");
var router = express.Router();
express().set("view engine", "pug");


router.get('/', function(req, res) {
  res.render('frontPage');
});

router.get('/dashboard',async(req,res)=>{
  const users = await User.findOne({username:req.session.user})
  const rating = await Rating.find({username:req.session.user}).select('rating')
  const ratings = await Rating.find({username:req.session.user}).sort({'_id': -1}).limit(3)
  const pickups = await PickupOrder.find({username:req.session.user})
  console.log(pickups.length)
  average = rating.reduce((sum, { rating }) => sum + rating, 0) / rating.length
  if(req.session.user){
    res.render('dashboard',{user:users,driver:users.driver,average:average,ratings:ratings, pickupamount: pickups.length})
  }else{
    res.send('Unauthorized User')
  }
})

router.get('/logout',(req,res)=>{
  req.session.destroy(function(err){
    if(err){
      consol.log(err);
      res.send('Error')
    }else{
      res.render('login',{title:'Express',logout:'Logout Successfully!'})
    }
  })
})

router.get('/delete',(req,res)=>{
  if(req.session.user){
    res.render('deleteUser',{title:'Delete user',user:req.session.user})
  }else{
    res.send('Unauthorized User')
  }
})


router.post('/delete',async(req,res)=>{
  try{
    console.log(req.session.user)
    const users = await User.findOne({username:req.session.user})
    const a1 = await users.delete()
    req.session.destroy(function(err) {
      if (err) {
        console.log(err);
        res.send('Error')
      } else {
        res.render('login', {title: 'Login', logout: 'The user has been deleted!'})
      }
    })
  }catch(err){
    res.send('Error')
  }
})

router.get('/pickup',(req,res)=>{
  if(req.session.user){
    res.render('pickupOrder',{user:req.session.user})
  }else{
    res.send('Unauthorized User')
  }
})

router.get('/update',async(req,res)=>{
  const users = await User.findOne({username:req.session.user})
  if(req.session.user){
    res.render('updateUser',{user: users})
  }else{
    res.send('Unauthorized User')
  }
})

//TODO fix update
router.post('/update', async(req,res) =>{
  const users = await User.findOne({username:req.session.user})
  users.username = req.body.username
  users.password = req.body.password
  users.address = req.body.address
  users.region = req.body.region
  //users.driver = req.body.driver
  await users.save()
  res.redirect('dashboard')
  /*try{

  }catch{
    res.send('Error her')
  }*/
})

router.get('/rating',(req,res)=>{
  if(req.session.user){
    res.render('ratingSystem', {user:req.session.user})
  }else{
    res.send('Unauthorized User')
  }
})

router.post('/rating', async (req,res)=>{
  console.log(req.session.user)
  try{
    const rating = new Rating ({
      username: req.session.user,
      rating: req.body.rating,
      comment: req.body.comment
    })
    await rating.save()
    res.redirect('/dashboard')
  } catch{
    res.send('Æv var')
  }
})


router.get('/pictures',async(req,res)=>{
  const pickup = await PickupOrder.find()
  if(req.session.user){
    res.render('viewImageForRating',{pickups: pickup, user:req.session.user})
  }else{
    res.send('Unauthorized User')
  }
})

router.get('/rating/:id', async(req,res)=>{
  const pickup = await PickupOrder.find()
  if(req.session.user){
    try {
      res.render('ratingUser', {pickups: pickup, url: req.params.id});
    }catch (err) {
      res.send('Error')
    }
  }else{
    res.send('Unauthorized User')
  }
})

router.post('/rating/:id', async (req,res)=>{
  const pickup = await PickupOrder.findOne({url:req.params.id})
  try{
    const rating = new Rating ({
      username: pickup.username,
      rating: req.body.rating,
      comment: req.body.comment
    })
    await rating.save()
    res.redirect('/dashboard')
  } catch{
    res.send('Æv var')
  }
})

router.get('/ratingsList', async(req, res) => {
  if(req.session.user){
    try {
      const ratings = await Rating.find({username:req.session.user})
      console.log('ratingsList' + ratings)
      res.render('ratingsList', {ratings: ratings});
    }catch (err) {
      res.render('error')
    }
  }else{
    res.send('Unauthorized User')
  }
});


module.exports = router;