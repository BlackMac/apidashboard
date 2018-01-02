const sipgate = require("../models/sipgate")
const errorhandler = require("../helpers/errorhandler")

exports.get = (req, res) => {
    sipgate.getOpenCalls(req.session.bearer).then((result) => {
      console.log(result.data[0].participants)
        res.render('status', {
            calls: result.data ? result.data : null,
            pageStatus: true,
            //user:req.session.userdetails
        })
    }).catch(errorhandler.api.bind(null, req, res))
}
