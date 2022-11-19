const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Doctor = mongoose.model('Doctor');

router.get('/', (req, res) => {
    res.render("doctor/addOrEdit", {
        viewTitle: "Doctor"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var doctor = new Doctor();
    doctor.fullName = req.body.fullName;
    doctor.email = req.body.email;
    doctor.mobile = req.body.mobile;
    doctor.save((err, doc) => {
        if (!err)
            res.redirect('doctor/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("doctor/addOrEdit", {
                    viewTitle: "Insert doctor",
                    doctor: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Doctor.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('doctor/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("doctor/addOrEdit", {
                    viewTitle: 'Update doctor',
                    doctor: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Doctor.find((err, docs) => {
        if (!err) {
            res.render("doctor/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving doctor list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Doctor.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("doctor/addOrEdit", {
                viewTitle: "Update doctor",
                doctor: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Doctor.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/doctor/list');
        }
        else { console.log('Error in doctor delete :' + err); }
    });
});

module.exports = router;