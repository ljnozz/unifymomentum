module.exports = function (req,res,next){

  if(req.session.authenticated){
    res.locals.flash = {};
    if (!req.session.flash) return next();

    res.locals.flash = _.clone(req.session.flash);

    req.session.flash = {};
    return next();
  }

  var requireLoginError = [{message:'Debes iniciar sesion'}]
  req.session.flash={
    err:requireLoginError
  }
  res.redirect('session/new');
  return;
}
