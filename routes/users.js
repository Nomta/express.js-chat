var express = require('express');
var { HttpError } = require('http-errors');
const { isValidObjectId } = require('mongoose');
var User = require('../models/user')

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) return next(err)
    res.json(users)
  })
});

router.get('/:id', function(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return next(new HttpError(404, 'User not found'))
  }
  
  User.findById(req.params.id, function(err, user) {
    
    if (err) return next(err)
    if (!user) {
      return next(new HttpError(404, 'User not found'))
    }
    res.json(user)
  })
});

module.exports = router;
