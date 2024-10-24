const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Mongoose schema
const noticeSchema = new mongoose.Schema({
  notice: {
    type: String,
    required: [true, 'Notice is required'],
    minlength: [10, 'Notice must be at least 10 characters long'],
    maxlength: [500, 'Notice must be less than 500 characters'],
  },
  date: {
    type: Date,
    default: Date.now, // Automatically sets the current date
    required: [true, 'Date is required'],
  },
});

// Create the model from the schema
const noticeModel = mongoose.model('notice', noticeSchema);

// Define Joi validation schema
const validateNoticeModel = (noticeData) => {
  const schema = Joi.object({
    notice: Joi.string().min(10).max(500).required().messages({
      'string.empty': 'Notice is required',
      'string.min': 'Notice must be at least 10 characters long',
      'string.max': 'Notice must be less than 500 characters',
    }),
    date: Joi.date().optional().messages({
      'date.base': 'Please provide a valid date',
    }),
  });

  return schema.validate(noticeData);
};

module.exports = { noticeModel, validateNoticeModel };


