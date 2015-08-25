module.exports = config = {
    db: {
        dev: "mongodb://localhost/template",
        release: "mongodb://satnami:template@ds035563.mongolab.com:35563/template"
    },
    log: {
        staticPath: '/log'
    },
    secretKey: "!SaTm@SeCrEt@KeY!"
};