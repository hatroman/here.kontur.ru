var ig            = require('instagram-node').instagram(),
    log           = require('./log.js').file('collector.log'),
    request       = require('request'),
    mongo         = require('mongodb').MongoClient,
    mongo_url     = 'mongodb://localhost:27017/here_kontur_ru',
    users         = require('./here-staff-accounts.json'),
    client_id     = process.argv[2],
    client_secret = process.argv[3];

log.check(users.length == 0, 'Provide one or more users');
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
            console.log(err);
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
            --user_count;

            if (user_count == 0) {
                setTimeout(function() {
                    db.close();
                }, 10000);
            }
        }
    };

    var user_count = users.length;

    users.forEach(function (user) {
        request({
            url : 'https://api.instagram.com/v1/users/search?q=' + user + '&client_id=' + client_id
        }, function (err, response, body) {
            var data = JSON.parse(body);

            ig.user_media_recent(data.data[0].id, use);
        });
    });
});