const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Event Schema
const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    teamMemberLimit: {
        type: Number,
        required: true,
        min: 1
    },
    prizeMoney: {
        type: Number,
        required: true,
        min: 0
    },
    ageLimit: {
        type: Number,
        required: true,
        min: 0
    },
    eventLogo: {
        type: Buffer,
       
        match: /\.(jpeg|jpg|gif|png)$/
    }
});

// Create the Event Model
const eventModel = mongoose.model('event', eventSchema);


// Joi Validation Schema
function validateeventModel(event) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        teamMemberLimit: Joi.number().min(1).required(),
        prizeMoney: Joi.number().min(0).required(),
        ageLimit: Joi.number().min(0).required(),
        eventLogo: Joi.string().pattern(/\.(jpeg|jpg|gif|png)$/)
    });

    return schema.validate(event);
}

module.exports= {eventModel,validateeventModel} ;

