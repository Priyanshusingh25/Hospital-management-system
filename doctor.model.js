const mongoose = require('mongoose');

var doctorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    }
});

// Custom validation for email
doctorSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

mongoose.model('Doctor', doctorSchema);