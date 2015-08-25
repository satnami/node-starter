var authToken = require('./authToken');

module.exports = {
    isAuth: function (req, res, next) {
        var token = req.headers['x-access-token'];
        if (token) {
            authToken.verifyToken(token, function (err, decoded) {
                if (err) res.status(401).json({message: 'not Auth', value: err});
                else {
                    req.decoded = decoded;
                    next();
                }
            })
        }
        else res.status(401).json({message: 'not Auth', value: ''});
    }
};