var express = require('express');
var async = require('async');
var Twote = require('../models/twoteModel.js');
var router = express.Router();

module.exports = router;

var homeGET = function(req, res) {
	res.render("homeView", {});
}

module.exports.home = homeGET;