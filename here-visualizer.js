var log       = require('./log.js').file('visualizer.log'),
    express   = require('express'),
    app       = express(),
    mongo     = require('mongodb').MongoClient,
    mongo_url = 'mongodb://localhost:27017/here_kontur_ru',
    path      = './web/',
    port      = process.argv[2] || 80,
    limit     = process.argv[3] || 100;

var photos = [];

app
    .use(express.static(path))
    .get('/', function (req, res) {
        res.send(path + 'index.html');
    })
    .get('/data', function (req, res) {
        res.send({
            photos: photos
        });
    });

mongo.connect(mongo_url, function (err, db) {
    log.check(err);

    db.collection('photos').find({
        location: { $ne: null }
    }, {
        limit: limit,
        sort: [['created_time', 'desc']]
    }).toArray(function (err, docs) {
        log.check(err);

        docs.forEach(function (photo) {
            photos.push({
                location:  photo.location,
                from:      photo.from,
                link:      photo.link,
                thumbnail: photo.images.thumbnail,
                text:      photo.caption.text,
                created_time: photo.created_time
            });
        });

        app.listen(port, function() {
            console.log('Visualizer started at localhost:' + port);
        });
    });
});