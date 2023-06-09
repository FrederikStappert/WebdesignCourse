const mongoose = require('mongoose')


const ratingSystemSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: false
    }
})
module.exports = mongoose.model('Rating', ratingSystemSchema)