var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('underscore');

// express-session: sets req.cookies on all requests sent to your website
var session = require('express-session');

var mongoose = require('mongoose');
var MongoStore= require('connect-mongo')(session);
var findOrCreate = require('mongoose-findorcreate');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var routes = require('./routes/index');
var auth = require('./routes/auth');

var models = require('./models/models')
var User = models.User;

var FacebookStrategy = require('passport-facebook');

mongoose.createConnection(process.env.MONGODB_URI);

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => res.send('fuck'))

// Passport stuff here
app.use(session({
    secret: process.env.SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

// Tell Passport how to set req.user
// how express attaches req.user (to current user)
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// how express sets req.user = undefined for logout
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Tell passport how to read our user models
// LocalStrategy defines strategy for which we log ppl in 
passport.use(new LocalStrategy(function(username,  password, done) {
  // Find the user with the given username
  console.log("GOT IN");
  console.log("THIS IS PASSPORT LOCAL STRATEGY USERNAME" + username);
    User.findOne({ email: username }, function (err, user) {
      // if there's an error, finish trying to authenticate (auth failed)
      if (err) { 
        return done(err);
      }
      // if no user present, auth failed
      if (!user) {
        return done(null, false);
      }
      // if passwords do not match, auth failed
      if (user.password !== password) {
        return done(null, false);
      }
      // auth has succeeded
      return done(null, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: "250336585352608",
    clientSecret: "824d1d299000a1be8351350ee5f20e1a",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'first_name', 'last_name', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
  console.log("USER PROFILE LOOKS LIKE THIS: ", profile);
    User.findOrCreate({ facebookId: profile.id}, {
      facebookId: profile.id,
      first: profile.name.givenName,
      last: profile.name.familyName,
      email: profile._json.email
    }, function (err, user) {
      return done(err, user);
    });
  }
));

app.use(passport.initialize());
app.use(passport.session());

var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use('/', auth(passport));
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// websockets

io.on('connection', function (socket) {
  console.log('connected');

  var rooms = {};

  models.Messages.find({}, function(err, messageObjects) {
    var timeArray = _.sortBy(messageObjects, 'timesent');
    var roomArray = _.groupBy(timeArray, 'room');
    console.log(timeArray, "ARRAY OF MESSAGES SORTED BY TIME");
    console.log(roomArray, "ARRAY OF MESSAGED SORTED BY TIME BY ROOM")
    socket.emit('loadInbox', roomArray);
      // messageObjects.forEach(function(message) {
      // if(rooms[message.room]) {

      // } else {
      //   rooms.push({roomid: message.room, room: message})
      // }
    // })
  })






  socket.on('Ids', function(Ids) {
          console.log(Ids, 'Ids');


          var unsortedIds = [];
          for (var i = 0 ; i < Ids.length; i++) {
              unsortedIds.push(Ids[i]);
          }
          var sortedIds = Ids.sort();
          socket.room = sortedIds.join(',');
          socket.join(socket.room, function() {
            console.log('Successfully joined ' + socket.room);
          }) 

          models.Messages.find({$or: [{from: Ids[0], to: Ids[1]}, {from: Ids[1], to:Ids[0]}]}, function(err, messages) {
            if(err) {
              console.log(err)
            } else {
              console.log(messages)
              socket.emit('loadMessages', messages)
              socket.to(socket.room).emit('loadMessages', messages)
            }
          })


          socket.on('Send', function(messageSending) {
            console.log('Successfully sent ' + messageSending);
            console.log(unsortedIds[1], 'their ID');
            console.log(unsortedIds[0], 'my Id');
            models.User.findById(unsortedIds[1], function(err, user ){
              if (err) {
                console.log(err)
              } else {
                  var newMessage = new models.Messages({
                    to: unsortedIds[1],
                    from: unsortedIds[0],
                    fromName: user.first + ' ' + user.last,
                    messagecontent: messageSending,
                    timesent: new Date(),
                    room: socket.room
                  });
                  newMessage.save(function(err, success) {
                      if (err) {
                          console.log(err);
                      } else {
                        console.log('successfully saved message')
                        socket.emit('messageSent', newMessage)
                        socket.to(socket.room).emit('messageSent', newMessage)
                      }
                  })
              }
            })
          })
  })







// get socket.username
  // io.on('username', function(username) {
  //   // ...
  // models.message.find({$or: [from: socket.username, to: socket.username]}, function(err, messages) {
  //   //handle error
  //   messages.forEach(function(message) {
  //     socket.join(generateRoomname(message.from, message.to))
  //     socket.emit('message', {name: 'Austin Hawkins', time: '10:39 PM', body: "hey whats up"})
  //   })
  // })
  // })
})


var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('Started, listening on port ', port);
});

module.exports = app;