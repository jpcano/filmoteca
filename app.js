var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    assert = require('assert'),
    MongoClient = require('mongodb').MongoClient;

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));

function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render('error_template', { error: err });
}

app.get('/', function (req, res, next) {
    res.render('insert');
})

app.post('/insert', function (req, res, next) {
    var title = req.body.title;
    var year = req.body.year;
    var imdb = req.body.imdb;

    if (title == '' || year == '' || imdb == '') {
        next('Please insert all the data.')
    }
    else {
        MongoClient.connect('mongodb://localhost:27017/video', function (err, db) {
            assert.equal(null, err);
            console.log("Successfully connected to MongoDB.");
            db.collection('movies').insertOne({"title": title, "year": year, "imdb": imdb});
            res.render('insert_success');
        });
    }
});

app.use(errorHandler);

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Express server listening on port %s', port);
})