const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Medicine = mongoose.model('Medicine');

router.get('/', (req, res) => {
    res.render("medicine/addOrEdit", {
        viewTitle: "Medicine"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var medicine = new Medicine();
    medicine.medicinename = req.body.medicinename;
    medicine.price = req.body.price;
    medicine.quantity = req.body.quantity;
    medicine.expdate = req.body.expdate;
    medicine.save((err, doc) => {
        if (!err)
            res.redirect('medicine/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("medicine/addOrEdit", {
                    viewTitle: "Insert medicine",
                    medicine: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Medicine.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('medicine/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("medicine/addOrEdit", {
                    viewTitle: 'Update medicine',
                    medicine: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Medicine.find((err, docs) => {
        if (!err) {
            res.render("medicine/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving medicine list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'medicinename':
                body['medicinenameError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Medicine.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("medicine/addOrEdit", {
                viewTitle: "Update medicine",
                medicine: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Medicine.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/medicine/list');
        }
        else { console.log('Error in medicine delete :' + err); }
    });
});

module.exports = router;