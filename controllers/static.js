exports.get = (req, res) => {
    let filename = req.params.filename
    res.sendFile(filename, {root: './views/static'});
}