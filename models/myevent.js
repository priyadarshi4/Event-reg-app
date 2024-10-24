const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Mongoose schema
const myEventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Reference to the Event model
        required: true
    },
    event: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event', // Reference to the Event model
        required: true
        }
          ],
    enrolledDate: {
        type: Date,
        default: Date.now
    }
});

// Create the Mongoose model
const myEventModel = mongoose.model('myevent', myEventSchema);

// Joi validation schema
function validateMyEvent(data) {
    const schema = Joi.object({
        event: Joi.array().items(Joi.string()), // Validate as a MongoDB ObjectId
        user: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
        enrolledDate: Joi.date()
    });

    return schema.validate(data);
}

module.exports = {myEventModel,validateMyEvent};

