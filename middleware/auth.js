module.exports = (req, res, next) => {
    if (!req.session.bearer) {
        res.redirect(req.protocol + '://' + req.get('host') + '/login')
    } else {
        next()
    }
}