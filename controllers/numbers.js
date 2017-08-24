const sipgate = require("../models/sipgate")
const errorhandler = require("../helpers/errorhandler")

exports.get = (req, res) => {
    sipgate.getNumbers(req.session.bearer).then((numberinfo) => {
        res.render('numbers', {
            numbers: numberinfo.items,
            pageNumbers:true,
            user:req.session.userdetails
        })
    }).catch(errorhandler.api.bind(null, req, res))
}