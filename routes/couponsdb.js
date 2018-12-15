const express = require('express');
const router = express.Router();
//const session = require('express-session');
const mongoose = require('mongoose');
const querystring = require('querystring');
var db = require('../db');

var couponSchema = mongoose.Schema(	{name:String, title:String, image:String, body:String});

/* GET get coupons from db. */
router.get('/getCoupons', function(req, res, next) {
/*	mongoose.connect('mongodb://localhost:27017/couponsDb');
	let db = mongoose.connection;
	db.on('error', function() {
		console.log("error to connect to couponsDb");
	});
*/
	var mdb = db.get();
	var Coupon = mdb.model('coupons',couponSchema);

	Coupon.find().then(function(doc){
		var jsonObj = [];
		for(var i=0; i<doc.length; i++){
			let name = doc[i]._doc.name;
			if(typeof(name) != 'undefined'){
				let title = doc[i]._doc.title;
				let image = doc[i]._doc.image;
				let body = doc[i]._doc.body;
				console.log("get data from db name=" +name +" title=" +title +" image=" +image +" body=" +body);
				jsonObj.push({name: name, title: title, image: image, body: body});
			}
		}
		res.send(jsonObj);
		res.end("");
	});
});

/* POST add coupon to db. */
router.post('/addCoupon', function(req, res, next) {
/*	mongoose.connect('mongodb://localhost:27017/couponsDb');
	let db = mongoose.connection;

	db.on('error', function() {
		console.log("error to connect to couponsDb");
	});
*/
	var mdb = db.get();
	var Coupon = mdb.model('coupons',couponSchema);

	let bodyObj = querystring.parse(req.body);
	let name = bodyObj.name;
	let title = bodyObj.title;
	let image = bodyObj.image;
	let body = bodyObj.body;
	console.log("addCoupon, get post data name=" +name +" title=" +title +" image=" +image +" body=" +body);
	let coupon = new Coupon({name:name, title:title, image:image, body:body});

	coupon.save(function(err,row) {
		if(err) {
			console.log("coupon save error = " +err);
			res.send('error');
		}else{
			console.log("coupon save row success!");
			res.send('ok');
		}
		res.end("");
	});
});

/* GET remove coupon from db. */
router.get('/removeCoupon', function(req, res, next) {
/*	mongoose.connect('mongodb://localhost:27017/couponsDb');
	let db = mongoose.connection;
	db.on('error', function() {
		console.log("error to connect to couponsDb");
	});
*/
	var mdb = db.get();
	var Coupon = mdb.model('coupons',couponSchema);

	let name = req.query["name"];

	Coupon.findOneAndRemove({name:name}, function (err, coupon){
		if (err) {
			console.log("removeCoupon error = " +err);
			res.send({back: "error"});
		}else {
			console.log("removeCoupon success!");
			res.send({back: "ok"});
		}
		res.end("");
	});

});

/* POST update coupon on db. */
router.post('/updateCoupon', function(req, res, next) {
/*	mongoose.connect('mongodb://localhost:27017/couponsDb');
	let db = mongoose.connection;

	db.on('error', function() {
		console.log("error to connect to couponsDb");
	});
*/
	var mdb = db.get();
	var Coupon = mdb.model('coupons',couponSchema);

	let bodyObj = querystring.parse(req.body);
	let name = bodyObj.name;
	let title = bodyObj.title;
	let image = bodyObj.image;
	let body = bodyObj.body;
	console.log("updateCoupon, get post data name=" +name +" title=" +title +" image=" +image +" body=" +body);
	//let coupon = new Coupon({name:name, title:title, image:image, body:body});

	Coupon.findOne({name:name}, function(err, row) {
		if(err) {
			console.log("updateCoupon error = " +err);
			res.send('error');
		}else{
			row.name = name;
			row.title = title;
			row.image = image;
			row.body = body;
			row.save();
			console.log("updateCoupon row success!");
			res.send('ok');
		}
		res.end("");
	});
});
module.exports = router;
