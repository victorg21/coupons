const express = require('express');
const router = express.Router();
//const session = require('express-session');
const mongoose = require('mongoose');
const querystring = require('querystring');

var couponSchema = mongoose.Schema(
	{name:String, title:String, image:String, body:String});

/* GET users listing. */
router.get('/getCoupons', function(req, res, next) {
	mongoose.connect('mongodb://localhost:27017/couponsDb');
	let db = mongoose.connection;
	db.on('error', function() {
		console.log("error to connect to couponsDb");
	});

	var Coupon = mongoose.model('coupons',couponSchema);

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

/* POST add coupon listing. */
router.post('/addCoupon', function(req, res, next) {
	mongoose.connect('mongodb://localhost:27017/couponsDb');
	let db = mongoose.connection;

	db.on('error', function() {
		console.log("error to connect to couponsDb");
	});

	var Coupon = mongoose.model('coupons',couponSchema);
	console.log("coupon save row success!");

	let bodyObj = querystring.parse(req.body);
	let name = bodyObj.name;
	let title = bodyObj.title;
	let image = bodyObj.image;
	let body = bodyObj.body;
	console.log("get post data name=" +name +" title=" +title +" image=" +image +" body=" +body);
	let coupon = new Coupon({name:name, title:title, image:image, body:body});

	coupon.save(function(error,row) {
		if(error) {
			console.log("coupon save error = " +error);
			res.send('error');
		}else{
			console.log("coupon save row success!");
			res.send('ok');
		}
		res.end("");
	});
});

module.exports = router;
