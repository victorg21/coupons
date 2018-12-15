const mongoose = require('mongoose');
//var MongoClient = require('mongodb').MongoClient

var state = {
	db: null,
}

exports.connect = function(url, done) {
	if (state.db) return done()
/*
	MongoClient.connect(url, function(err, db) {
		if (err) return done(err)
		state.db = db
		done()
	})
*/
	mongoose.connect(url);
	let db = mongoose.connection;

	db.on('error', function(err) {
		console.log("error to connect to couponsDb err = " +err);
		state.db = null;
	});

	db.on('connected', function() {
		console.log("Connect to " +url);
		state.db = db;
	});
}

exports.get = function() {
	return state.db
}

exports.close = function(done) {
	if (state.db) {
		state.db.close(function(err, result) {
			state.db = null
			state.mode = null
			done(err)
		})
	}
}