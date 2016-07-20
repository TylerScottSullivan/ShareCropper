var express = require('express');
var router = express.Router();
var models = require('../models/models')
var User = models.User;
var Follows = models.Follows;


var Crop = models.Crop;
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


//S3 shit should go in app.js??
var s3 = require('s3');

/* GET home page. */
// router.get('/', function(req, res, next) {
// 	console.log("this is the home")
//   res.render('index', { title: 'Express' });
// });

router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Sharecropper'
	});
});

router.get('/home', function(req, res, next) {
	res.render('home', {
		user: req.user
	});
});

router.get('/editprofile', function(req, res, next) {
	res.render('editprofile', {
		user: req.user
	});
});

router.post('/editprofile', function(req, res, next) {
	User.findByIdAndUpdate(req.user._id, {
		first: req.body.first,
		last: req.body.last,
		biography: req.body.biography
	}, function(err, user) {
		if (err) {
			console.log(err)
			next(err)
		}
		else {
			res.redirect('/myprofile')
		}
	})
})

router.get('/about',  function(req, res, next) {
	res.render('about');
});

router.get('/messages', function(req, res, next) {
	res.render('messages');
});

router.get('/cardinfo', function(req, res, next) {
	res.render('cardinfo');
});

router.get('/reportproblem', function(req, res, next) {
	res.render('reportproblem');
});

router.get('/contact', function(req, res, next) {
	res.render('contact');
});

router.get('/creategarden', function(req, res, next) {
	res.render('creategarden');
});

router.post('/creategarden', function(req, res, next) {
    //console.log("LOOK HERE: ", req.body)
    var newCrop = new models.Crop ({
        cropname: req.body.cropname,
        price: req.body.price,
        unit: req.body.per,
        status: req.body.status,
        instore: req.body.instore,
        notes: req.body.notes
    });
    newCrop.save(function(err, success) {
        if (err) {
            console.log(err);
        }
        else {
            models.User.findByIdAndUpdate(req.user._id, {
                'cropArr': req.user.cropArr.concat(newCrop._id)
            }, function(err, user) {
                if (err) {
                    console.log(err);
                    next(err)
                }
                else {
                    console.log("CREATED NEW CROP", req.user);
                    res.redirect('/myprofile')
                }
            })
        }
    })
});

router.get('/uploadphoto/:cid', function(req,res,next){
	res.render('uploadphoto', {cid: req.params.cid});
});
router.post('/uploadphoto/:cid', upload.single('file'), function(req,res,next){
	//Making S3 work
var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: "us-east-1",
    signatureVersion:"v3",
    
    // endpoint: 's3.yourdomain.com',
    // sslEnabled: false
    // any other options are passed to new AWS.S3()
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  },
});

var params = {
  localFile: req.file.path,
  s3Params: {
    Bucket: "sharecropper",
    Key: "some/remote/"+req.user.cropArr[0]+".png",
    ACL: "bucket-owner-full-control",
    ContentType: "image/png"
    // other options supported by putObject, except Body and ContentLength.
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
  },
};
var uploader = client.uploadFile(params);
uploader.on('error', function(err) {
  console.error("unable to upload:", err.stack);
});
uploader.on('progress', function() {
  console.log("progress", uploader.progressMd5Amount,
            uploader.progressAmount, uploader.progressTotal);
});
uploader.on('end', function() {
	var image_URI = 'https://s3-us-west-2.amazonaws.com/sharecropper/some/remote/'+req.params.cid+'.png';
		models.Crop.findByIdAndUpdate(req.params.cid, {
			'image': image_URI
				},function(err, crop){
					if(err){
						console.log(err);
					}
					res.redirect('/myprofile')

		});
  console.log("done uploading");
});
});

router.post('/creategarden', function(req, res, next) {
	//console.log("LOOK HERE: ", req.body)
	var newCrop = new models.Crop ({
		cropname: req.body.cropname,
		price: req.body.price,
		unit: req.body.per,
		status: req.body.status,
		instore: req.body.instore,
		notes: req.body.notes
	});
	newCrop.save(function(err, success) {
		if (err) {
			console.log(err);
		}
		else {
			User.findByIdAndUpdate(req.user._id, {
				'cropArr': req.user.cropArr.concat(newCrop._id)
			}, function(err, user) {
				if (err) {
					console.log(err);
					next(err)
				}
				else {
					console.log("CREATED NEW CROP", req.user);
					res.redirect('/myprofile')
				}
			})
		}
	})
});

router.get('/becomeseller', function(req, res, next) {
	res.render('becomeseller');
});

router.get('/transactions', function(req, res, next) {
	res.render('transactions');
});

router.get('/myprofile', function(req, res, next) {
	User.findOne({_id: req.user._id}).populate('cropArr').exec(function(err, user) {
		if (err) {
			console.log(err)
		}
		res.render('myprofile', {
			user: user,
			crop: user.cropArr
		});
	});
});

router.post('/myprofile', function(req, res, next) {
	User.findByIdAndUpdate(req.user._id, {
		'seller': !req.user.seller
	}, function(err, user) {
		if (err) {
			console.log(err);
			next(err)
		}
		else {
			console.log("Changed seller status: ", req.user.seller);
			res.redirect('/myprofile')
		}
	})
})

router.get('/testprof', function(req, res, next) {
	res.render('userprofile');
});

router.get('/testseller', function(req, res, next) {
	res.render('sellerprofile');
	User.findOne({_id:req.user._id}).populate('cropArr').exec(function(err, user) {
		if (err) {
			console.log(err);
		}
		console.log("user: ", user);
		res.render('myprofile', {
			user: user,
			crop: user.cropArr
		})
	});
});

router.get('/profile/:id', function(req, res, next) {
	if (req.params.id.toString() === req.user._id.toString()) {
		res.redirect('/myprofile')
	}
	else {
		User.findOne({_id: req.params.id}).populate('cropArr following').exec(function(err, user) {
			if (err) {
				console.log(err);
			}
			else {
				var user = user;
				Follows.find({iamfollowed: req.params.id}, function(err, follows) {
					if (err) {
						console.log(err)
					}
					else if (user.seller) {
						res.render('sellerprofile', {
							user: user,
							crop: user.cropArr,
							following: user.following,
							followers: follows
						});
					}
					else {
						res.render('userprofile', {
							user: user,
							crop: user.cropArr,
							following: user.following,
							followers: follows
						});
					}
				});
			}
			
		});
	};
});

router.get('/follow/:id', function(req, res, next) {
	Follows.find({iamfollower: req.user._id, iamfollowed: req.params.id}, function(err, docs) {
		if (err) {
			console.log(err)
		}
		else if (docs.length) {
			res.redirect('/profile/'+req.params.id);
		}
		else {
			var newFollow = new models.Follows ({
				iamfollower: req.user._id,
				iamfollowed: req.params.id
			});
			newFollow.save(function(err, success) {
				if (err) {
					console.log(err)
					next(err)
				}
				else {
					User.findByIdAndUpdate(req.user._id, {
						'following': req.user.following.concat(newFollow._id)
					}, function(err, user) {
						if (err) {
							console.log(err)
							next(err)
						}
						else {
							console.log("added a follower", user.following)
							res.redirect('/profile/'+req.params.id);
						}
					});
				}
			});
		}
	})
	
});



module.exports = router;
