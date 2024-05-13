const mongoose = require('mongoose');
const path = require('path');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    hasActors: {
        type: Boolean,
        default: false
    },
    actors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor'  // Зазначте, що це буде посилання на іншу схему 'Actor', яку ви маєте створити
    }],
    duration: {
        type: Number,
        required: true  // Час на проходження у хвилинах
    },
    playerLimits: {
        min: { 
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        }
    },
    thumbnail: {
        type: String,
        default: '/img/default_image.png'
    }
});

module.exports = mongoose.model('Room', roomSchema);
