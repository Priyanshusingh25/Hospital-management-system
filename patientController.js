const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Patient = mongoose.model('Patient');

router.get('/', (req, res) => {
    res.render("patient/addOrEdit", {
        viewTitle: "Patient"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var patient = new Patient();
    patient.fullName = req.body.fullName;
    patient.email = req.body.email;
    patient.mobile = req.body.mobile;
    patient.save((err, doc) => {
        if (!err)
            res.redirect('patient/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("patient/addOrEdit", {
                    viewTitle: "Insert patient",
                    patient: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Patient.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('patient/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("patient/addOrEdit", {
                    viewTitle: 'Update patient',
                    patient: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Patient.find((err, docs) => {
        if (!err) {
            res.render("patient/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving patient list :' + err);
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
    Patient.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("patient/addOrEdit", {
                viewTitle: "Update patient",
                patient: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Patient.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/patient/list');
        }
        else { console.log('Error in patient delete :' + err); }
    });
});

module.exports = router;