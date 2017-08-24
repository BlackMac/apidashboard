const sipgate = require("../models/sipgate")
const errorhandler = require("../helpers/errorhandler")

exports.get = (req, res) => {
    sipgate.getClients(req.session.bearer).then((result) => {
        res.render('phone', {
            apiClient: result.data[0] ? result.data[0] : null,
            pagePhone: true,
            user:req.session.userdetails
        })
    }).catch(errorhandler.api.bind(null, req, res))
}
