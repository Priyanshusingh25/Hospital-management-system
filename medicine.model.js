const mongoose = require('mongoose');

var medicineSchema = new mongoose.Schema({
    medicinename: {
        type: String,
        required: 'This field is required.'
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    expdate: {
        type: Date
    }
});

mongoose.model('Medicine', medicineSchema);