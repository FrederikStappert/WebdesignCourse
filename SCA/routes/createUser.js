var express = require('express');
const User = require("../models/user");
var router = express.Router();

/* GET create form. */
router.get('/', function(req, res, next) {
    res.render('createUser', { title: 'Create user' });
});


router.post('/', async(req,res) =>{
    const users = new User ({
        username: req.body.username,
        password: req.body.password,
        driver: req.body.driver,
        address: req.body.address,
        region: req.body.region
    })
    console.log(users)
    const user = await User.findOne({username:req.body.username})
    if(user){
        res.render('createUser', { title: 'Create user' , userexists: 'true',
            username: req.body.username, password: req.body.password, address: req.body.address});}
    else{
    try{
        await users.save()
        res.render('login',{title:'Login',logout:'User created successfully!'})
    }catch (err){
        res.send('Error')
    }}
})
module.exports = router;