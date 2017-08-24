exports.api = (req, res, e) => {
    if (e.status_code == 401) return(res.redirect("/login"))
    incidentinfo = {
        user: req.session.userdetails,
        error: e,
        page: req.path
    }
    res.render('error',{
        error: JSON.stringify(incidentinfo, null, "  ")
    })
}