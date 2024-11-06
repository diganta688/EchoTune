module.exports.isuserLoggeddIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in");
        return res.redirect("/user/login");
    }
    next();
};

module.exports.isadminLoggeddIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in");
        return res.redirect("/admin/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};