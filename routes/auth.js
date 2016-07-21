var express = require('express');
var router = express.Router();
var models = require('../models/models');
var passport = require('passport');

module.exports = function(passport) {

	router.get('/', function(req, res, next) {
		res.render('index', {
			title: 'Sharecropper'
		});
	});

	router.get('/about',  function(req, res, next) {
		res.render('about');
	});

	router.get('/reportproblem', function(req, res, next) {
		res.render('reportproblem');
	});

	router.get('/contact', function(req, res, next) {
		res.render('contact');
	});

	router.get('/testprof', function(req, res, next) {
		res.render('userprofile');
	});

	router.get('/testseller', function(req, res, next) {
		res.render('sellerprofile');
	});

	router.get('/signup', function(req, res, next){
		res.render('signup');
	});

	router.post('/signup', function(req, res, next){

		if (!(req.body.email && req.body.pass && req.body.pass2)){
			throw new Error("input all fields");
		}

		var pass = req.body.pass;
		var pass2 = req.body.pass2;
		if (pass === pass2){
			var newUser = new models.User(
			{
				first: req.body.first,
				last: req.body.last,
				email: req.body.email,
				password: req.body.pass
			});

			newUser.save(function(err, success){
				if (err) {
					console.log(err);
				}
				else {
					console.log("CREATED NEW USER SUCCESSFULLY ON SIGNUP" + success);
					res.redirect('/login');
				}
			})
		}
		else {
			res.redirect('/signup');
		}
	});

	router.get('/login', function(req, res, next){
		res.render('login');
	});

	router.post('/login', passport.authenticate('local'), function(req, res, next){
	   res.redirect('/home');
	});

	router.get('/auth/facebook',
		  passport.authenticate('facebook',{scope : ['email'] }));

	router.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/login' }),
	  function(req, res) {
	    // Successful authentication, redirect home.
	    res.redirect('/home');
	    // DO SHIT HERE
	  });


	  router.use(function(req, res, next) {
	    if (!req.user) {
	      res.redirect('/login');
	    } else {
	      next();
	    }
	  })

	router.get('/logout', function(req, res, next){
		req.logout();
		res.redirect('/login');
	}); 

  return router;
}