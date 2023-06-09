const mongoose = require('mongoose')


const pickupOrderSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false
    },
    date: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    region: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
    driver: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    }
})
module.exports = mongoose.model('PickupOrder',pickupOrderSchema)