/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var SeafileAPI = require('seafile-api');
var Promise = require("bluebird");
var sf = new SeafileAPI('http://www.drive.ljnozz.tk', '2a6b93c741cff98995521ea227e7ab173dc235fa');

function listar(){

	return new Promise(function (resolve,reject) {

			sf.listAccounts({
			start: 0,
			limit: 100,
			scope: 'DB'
		}, function(err, accounts, httpcode){
			if(err){
				console.error('Error:', err);
				reject();
			}
			console.log(accounts);
			resolve();
		})
	})

}

function eliminar(){
	return new Promise(function (resolve,reject) {
		sf.deleteAccount('johndoe@example.com', function(err, body, httpcode){
			console.log(body);
			resolve();
		})
	})

}

function crear(){
return new Promise(function (resolve,reject) {
	sf.createAccount({
		email: 'johndoe@example.com',
		password: 'foobar123',
		is_staff: 0,
		is_active: 1
	}, function(err, data, httpcode){
		console.log(data);
		resolve();
	})
})
}

module.exports = {

	new:function(req, res) {
			console.log('Entre al formulario de registro');
			res.view();
	},
  //////////////////////////////////////////////////////////////////////////////
	username:function (req, res) {

			listar().then(crear).then(listar).then(eliminar).then(listar);

			User.findOne({
				username: req.param('username')
			}).exec(function (err, user){
				if (err) {
					console.log(res.serverError(err));
					res.send(500, { error: 'DB Error' });
				}
				if (!user) {
					console.log('Usuario disponible');
					res.send(200, 'Usuario disponible!' );
				}
				if(user){
					sails.log('usuario no disponible "%s"', user);
					return res.send(202, { error: 'Usuario no dispobible' });
				}

			});
	},
  //////////////////////////////////////////////////////////////////////////////
	configuracion:function(req, res) {
			console.log('Entre al formulario de configuracion');

			res.view();
	},
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
	create:function(req, res) {
			var userObj={
				name: req.param('name'),
				last_name: req.param('last_name'),
				username: req.param('username'),
				email: req.param('email'),
				password: req.param('password'),
				passwordConfirmation: req.param('passwordConfirmation')
			}

			User.create(userObj, function (err, user){
				if(err){
					console.log(JSON.stringify(err));
					//return res.view('500');
					req.session.flash={
						err:err
					}
					return res.redirect('user/new');
				}
				res.redirect('user/show/'+user.id);
			});
	},
  //////////////////////////////////////////////////////////////////////////////
	show: function(req, res, next) {
			User.findOne(req.param('id'), function userFounded(err,user){
				if(err)
					return next(err);
				res.view({
					user: user
				});
			});
	},
  //////////////////////////////////////////////////////////////////////////////
	edit: function(req, res, next) {
			User.findOne(req.param('id'), function userFounded(err, userObject){
				if (err)
					return next(err);
				if(!userObject)
					return next();
				res.view({
					user1: userObject
				});
			});
	},
  //////////////////////////////////////////////////////////////////////////////
	update: function(req, res, next) {
			var userObj={
				name: req.param('name'),
				last_name: req.param('last_name'),
				username: req.param('username'),
				email: req.param('email')
			}
			User.update(req.param('id'), userObj,function userUpdated(err, user){
				if(err) {
					rep.session.flash = {
						err: error
					}
					return res.redirect('user/edit/' + req.param('id'));
				}

				res.redirect('/user/show/' + req.param('id'));
			});
	},
  //////////////////////////////////////////////////////////////////////////////
	index: function (req, res, next){
			User.find(function userFounded (err, users){
				if(err){
					console.log(err);
					return next(err);
				}
				res.view({
					users: users
				});
			});
	}

};
