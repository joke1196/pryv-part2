const MongoClient = require('mongodb').MongoClient

exports.url = "mongodb://root:example@127.0.0.1:27017/?retryWrites=true&w=majority&useUnifiedTopology=true"

let state = {
    db: null,
}

exports.connect = function (url, done) {
    if (state.db) return done()

    MongoClient.connect(url, function (err, db) {
        if (err) return done(err)
        state.db = db
        return done()
    })
}

exports.get = function () {
    return state.db
}

exports.close = function (done) {
    if (state.db) {
        state.db.close(function (err, result) {
            state.db = null;
            if (err) return done(err)
            return done(err)
        })
    }
}