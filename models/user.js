// userModel.js
const mongoose = require('mongoose');
const Joi = require('joi');

// Define User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /.+\@.+\..+/, // Basic email regex
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    }
}, { timestamps: true });

// Create User Model
const userModel = mongoose.model('user', userSchema);

// Register Validation Schema
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(2)
            .max(50)
            .required(),
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
        
    });
    return schema.validate(data);
};

// Login Validation Schema
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
         event: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
    });
    return schema.validate(data);
};

module.exports = {userModel,
    registerValidation,
    loginValidation
};
