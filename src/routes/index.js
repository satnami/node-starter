var api = require('./api'),
    auth = require('../security/auth');

module.exports = function (app) {

    //-----------------Views-------------------
    app.get('/', api.views.index);

    //-------------------Meals API---------------------
    /**
     * @api {get} /api/users/all Get All Users
     * @apiName GetALL
     * @apiGroup Users
     *
     * @apiSuccess {Object[]} Meal[] Array Of Object Users.
     */
    app.get('/api/users/all', api.users.get);


    //-------------------Auth API----------------------
    app.post('/api/auth/create', api.auth.create);

    app.post('/api/auth/login', api.auth.login);

    //----------------Error Handler-------------------
    app.use(api.error.error);

};