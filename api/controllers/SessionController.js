/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
		new:function (req, res){
			res.view();
		}, create:function (req,res,next){
			var username = req.param('username');
			var password = req.param('password');
			if(!username || !password){
				var noUsernameOrPasswordError = [{message:'Debe ingresar un usuario y contraseña'}]
				req.session.flash={
					err:noUsernameOrPasswordError 
				}
				return res.redirect('/session/new')
			}

			User.findOneByUsername(username, function userFounded (err, user){
				if(err){
					req.session.flash={
						err:err
					}
					return res.redirect('/session/new');
				}
				if(!user){
					var noUserFounderError=[{message:'El nombre de usuario no se encuentra'}]
					req.session.flash={
						err:noUserFounderError
					}
					return  res.redirect('/session/new');
				}
				if(password != user.password){
					var passwordDoNotMatch = [{message:'Contraseña incorrecta'}]
					req.session.flash={
					err:passwordDoNotMatch
					}
					return res.redirect('/session/new');
				}
				req.session.authenticated = true;
				req.session.User = user;
				//res.redirect('/user/show/'+user.id);
				res.redirect('/user/index');

			});
		},
		destroy: function(req,res,next){
			req.session.destroy();
			res.redirect('/session/new');
		}
};
