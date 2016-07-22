var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

// Create a connect.js inside the models/ directory that
// exports your MongoDB URI!
var connect = process.env.MONGODB_URI || require('./connect');

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);

var UserSchema = new mongoose.Schema({
    first: {
    	type: String,
    	required: true
    },
    last: {
    	type: String,
    	required: true
    },
    email: {
    	type: String,
    	required: true
    },
    password: {
    	type: String
    },
    profileimg: {
    	type: String
    },
    biography: {
    	type: String
    },
    address: {
    	type: String
    },
    grower: {
    	type: Boolean,
    	default: false
    },
    seller: {
    	type: Boolean,
    	default: false
    },
    cropArr: [{
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Crop'
    }],
    following: [{
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Follows'
    }],
    defaultPayment: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Payment'
    }
});

var CropSchema = new mongoose.Schema({
	cropname: {
		type: String,
		required: true
	},
	image: {
		type: String
	},
	price: {
		type: String
	},
	unit: {
		type: String
	},
	cropimg: {
		type: String
	},
	status: {
		type: String
	},
	instore: {
		type: Boolean,
		default: false
	},
	notes: {
		type: String
	},
	rating: {
		type: Number
	}
});

var NotificationSchema = new mongoose.Schema({
	userid: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	message: {
		type: String
	}
});

var MessageSchema = new mongoose.Schema({
	to: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	from: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	messagecontent: {
		type: String,
		required: true
	},
	timesent: {
		type: Date,
		required: true
	},
	class: {
		type: String,
		required: true,
		default: "regular"
	}
});

var TransactionSchema = new mongoose.Schema({
	cropArr: [{
		type: Object

	}],
	total: {
		type: Number,
		required: true
	},
	discount: {
		type: Number,
		default: 0
	},
	status: {
		type: Number
	},
	purchaser: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User"
	},
	seller: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User"
	},
	timedate: {
		type: Date,
		required: true
	},
	payment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Payment"
	}
});

var FollowSchema = new mongoose.Schema({
	iamfollower: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User"
	},
	iamfollowed: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User"
	}
});

var PaymentSchema = mongoose.Schema({
  stripeBrand: {
  	type: String
  },
  stripeCustomerId: {
  	type: String
  },
  stripeExpMonth: {
  	type: Number
  },
  stripeExpYear: {
  	type: Number
  },
  stripeLast4: {
  	type: Number
  },
  stripeSource: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    default: 100
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

UserSchema.plugin(findOrCreate);
// Create all of your models/schemas here, as properties.
var models = {
	User: mongoose.model('User', UserSchema),
	Crop: mongoose.model('Crop', CropSchema),
	Notifications: mongoose.model('Notifications', NotificationSchema),
	Messages: mongoose.model('Messages', MessageSchema),
	Transactions: mongoose.model('Transactions', TransactionSchema),
	Follows: mongoose.model('Follows', FollowSchema),
	Payment: mongoose.model('Payment', PaymentSchema)
};

module.exports = models;