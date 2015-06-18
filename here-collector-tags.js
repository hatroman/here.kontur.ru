var ig            = require('instagram-node').instagram(),
    log           = require('./log.js').file('collector.log'),
    mongo         = require('mongodb').MongoClient,
    mongo_url     = 'mongodb://localhost:27017/here_kontur_ru',
    tags          = require('./here-collector-tags.json'),
    client_id     = process.argv[2],
    client_secret = process.argv[3];

log.check(tags.length == 0, 'Provide one or more tags');
log.check(!client_id || !client_secret, 'Provide client_id and client_secret for Instagram API');

mongo.connect(mongo_url, function (err, db) {
    log.check(err);

    var collection = db.collection('photos');

    ig.use({
        client_id:     client_id,
        client_secret: client_secret
    });

    var upserted_count = 0;

    var use = function (err, photos, pagination, remaining, limit) {
        if (err) {
            console.log('Retrying after ' + err.code + '...');

            setTimeout(function() {
                err.retry();
            }, 1000);

            return;
        }

        photos.forEach(function (photo) {
            collection.updateOne({ id: photo.id }, photo, { upsert: true }, function(err, result) {
                log.check(err);

                upserted_count += result.upsertedCount;
            });
        });

        if (upserted_count > 0 && pagination.next) {
            pagination.next(use);
        }
        else {
            --tag_count;

            if (tag_count == 0) {
                setTimeout(function() {
                    db.close();
                }, 10000);
            }
        }
    };

    var tag_count = tags.length;

    tags.forEach(function (tag) {
        ig.tag_media_recent(tag, use);
    });
});