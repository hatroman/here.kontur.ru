var log           = require('./log.js').file('collector.log'),
    request       = require('request'),
    fs            = require('fs'),
    accounts_file = './here-staff-accounts.json',
    accounts      = require(accounts_file),
    client_id     = process.argv[2],
    client_secret = process.argv[3];

log.check(!client_id || !client_secret, 'Provide client_id and client_secret for Staff API');

var url = "https://" + client_id + ":" + client_secret + "@passport.skbkontur.ru/authz/staff/oauth/token";

request.post({
    url : url,
    headers: { 'content-type' : 'application/x-www-form-urlencoded' },
    body : 'grant_type=client_credentials&scope=profiles'
}, function (err, response, body) {
    var token = JSON.parse(body).access_token;

    request({
        url : 'https://staff.skbkontur.ru/api/users/',
        headers: { 'authorization': 'Bearer ' + token }
    }, function (err, response, body) {
        var users = JSON.parse(body);
        var users_count = users.length;

        users.forEach(function (user) {

            request({
                url : 'https://staff.skbkontur.ru/api/users/' + user.sid,
                headers: { 'authorization': 'Bearer ' + token }
            }, function (err, response, body) {
                user = JSON.parse(body);

                user.contacts.forEach(function (contact) {
                    if (contact.type == 'instagram') {
                        accounts.push(contact.value);
                    }
                });

                --users_count;

                if (users_count == 0) {
                    // Leave unique accounts
                    accounts = accounts.filter(function(elem, pos) {
                        return accounts.indexOf(elem) == pos;
                    });

                    console.log(accounts);

                    fs.writeFile(accounts_file, JSON.stringify(accounts));
                }
            });
        });
    });
});