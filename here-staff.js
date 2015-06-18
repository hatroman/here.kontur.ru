var log           = require('./log.js').file('collector.log'),
    mongo         = require('mongodb').MongoClient,
    mongo_url     = 'mongodb://localhost:27017/here_kontur_ru',
    // accounts      = require('./here-staff-accounts.json'),
    client_id     = process.argv[2],
    client_secret = process.argv[3];

// log.check(tags.length == 0, 'Provide one or more tags');
log.check(!client_id || !client_secret, 'Provide client_id and client_secret for Staff API');

// mongo.connect(mongo_url, function (err, db) {
//     log.check(err);

//     var collection = db.collection('photos');

//     ig.use({
//         client_id:     client_id,
//         client_secret: client_secret
//     });

//     var tag_counter   = tags.length,
//         photo_counter = 0;

//     tags.forEach(function (tag) {
//         ig.tag_media_recent(tag, function (err, photos, remaining, limit) {
//             log.check(err);

//             photo_counter += photos.length;
//             --tag_counter;

//             photos.forEach(function (photo) {
//                 collection.updateOne({ id: photo.id }, photo, { upsert: true }, function(err, result) {
//                     log.check(err);

//                     --photo_counter;

//                     if (tag_counter + photo_counter == 0) {
//                         db.close();
//                     }
//                 });
//             });
//         });
//     });
// });