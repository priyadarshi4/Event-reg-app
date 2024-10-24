// Importing necessary modules
const mongoose = require("mongoose");
const Joi = require("joi");

// Admin schema for Mongoose
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Simple email format validation
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024 // Allows for storing hashed passwords
    }
});

// Creating the Mongoose model
const adminModel = mongoose.model("admin", adminSchema);

// Joi validation function
const validateAdminModel = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(4).max(1024).required()
    });

    return schema.validate(data);
};

// Exporting the Mongoose model and Joi validation function
module.exports = {
    adminModel,
    validateAdminModel
};
