// This is where I define the behavior for routes

var express = require('express');
var async = require('async'); // not being used
var path = require('path');
var Article = require('../models/articleModel.js');
var router = express.Router();

// You're not really using the express router -- you're just attaching routes to the
// router object as properties, exporting the router object, and routing the manual way in your app.js file.
// Here's an example of the express router in use: https://github.com/olinjs/olinjs/blob/master/lessons/03-express-templates/christmasApp-solution/app.js

module.exports = router;

var homeGET = function(req, res) {
	res.sendFile(path.resolve('public/html/main.html'));
}

var articlesGET = function(req, res) {
	Article.find(function(err, articles) {
        if (err)
            res.status(500).json(err); // it's convention for server to set error code

        res.json(articles);
    });
}

var editArticlePOST = function(req, res) {
    // clean up your debugging mechanisms!
    Article.findById(req.body._id, function(err, todo) {
        todo.title = req.body.title;
        todo.introText = req.body.introText;
        todo.save(function (err, article) {
            if (err) return console.error(err) // be consistent with error handling mechanism
            res.send(article);
        });
    });
}

var newArticlePOST = function(req, res) {
    console.log(req.body)
    Article.create({
        title : req.body.title,
        introText: req.body.introText
    }, function(err, article) {
        if (err)
            return res.send(err); // again, be consistent -- you handled errors three different ways in this file!
        res.send(article)
    });

}

module.exports.home = homeGET;
module.exports.articles = articlesGET;
module.exports.editArticle = editArticlePOST;
module.exports.newArticle = newArticlePOST;
