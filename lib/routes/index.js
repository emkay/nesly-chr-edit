var methods = ['GET'];

module.exports = function (req, res) {
    if (! req.method in methods) return res.error(405);
    
    return res.template('index');
};
